
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/types/auth';

export const usePaymentMethods = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Fetch payment methods
  useEffect(() => {
    if (!user) return;

    const fetchPaymentMethods = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching payment methods:', error);
          toast({
            title: "Erè nan jwenn metòd peman yo",
            description: "Nou pa kapab jwenn metòd peman ou yo pou kounye a.",
            variant: "destructive"
          });
        } else {
          setPaymentMethods(data as PaymentMethod[]);
        }
      } catch (error) {
        console.error('Error in fetchPaymentMethods:', error);
        toast({
          title: "Erè nan kominikasyon",
          description: "Gen yon erè ki pase pandan nou t ap jwenn metòd peman ou yo.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();

    // Set up real-time subscription for payment methods
    const paymentMethodsChannel = supabase
      .channel('payment-methods-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'payment_methods', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPaymentMethods(current => [payload.new as PaymentMethod, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setPaymentMethods(current => current.map(method => 
              method.id === payload.new.id ? payload.new as PaymentMethod : method
            ));
          } else if (payload.eventType === 'DELETE') {
            setPaymentMethods(current => current.filter(method => method.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(paymentMethodsChannel);
    };
  }, [user, toast]);

  // Add a new payment method
  const addPaymentMethod = async (
    type: 'moncash' | 'natcash' | 'agent' | 'card',
    details: PaymentMethod['details']
  ) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou ajoute yon metòd peman.",
        variant: "destructive"
      });
      return { success: false };
    }

    setAdding(true);
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          type,
          details,
          is_verified: type === 'card' // Cards are auto-verified for demo
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding payment method:', error);
        toast({
          title: "Erè",
          description: "Nou pa kapab ajoute metòd peman sa a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Siksè",
        description: "Metòd peman ajoute avèk siksè.",
      });
      return { success: true, method: data as PaymentMethod };
    } catch (error) {
      console.error('Error in addPaymentMethod:', error);
      toast({
        title: "Erè",
        description: "Gen yon erè ki pase pandan n ap eseye ajoute metòd peman an.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setAdding(false);
    }
  };

  // Remove a payment method
  const removePaymentMethod = async (id: string) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou efase yon metòd peman.",
        variant: "destructive"
      });
      return { success: false };
    }

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing payment method:', error);
        toast({
          title: "Erè",
          description: "Nou pa kapab efase metòd peman sa a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Siksè",
        description: "Metòd peman efase avèk siksè.",
      });
      return { success: true };
    } catch (error) {
      console.error('Error in removePaymentMethod:', error);
      toast({
        title: "Erè",
        description: "Gen yon erè ki pase pandan n ap eseye efase metòd peman an.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  return {
    paymentMethods,
    loading,
    adding,
    addPaymentMethod,
    removePaymentMethod
  };
};
