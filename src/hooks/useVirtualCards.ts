
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { VirtualCard } from '@/types/auth';

export const useVirtualCards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Fetch virtual cards
  useEffect(() => {
    if (!user) return;

    const fetchVirtualCards = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('virtual_cards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching virtual cards:', error);
          toast({
            title: "Erè nan jwenn kat vityèl yo",
            description: "Nou pa kapab jwenn kat vityèl ou yo pou kounye a.",
            variant: "destructive"
          });
        } else {
          setVirtualCards(data as VirtualCard[]);
        }
      } catch (error) {
        console.error('Error in fetchVirtualCards:', error);
        toast({
          title: "Erè nan kominikasyon",
          description: "Gen yon erè ki pase pandan nou t ap jwenn kat vityèl ou yo.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVirtualCards();

    // Set up real-time subscription for virtual cards
    const virtualCardsChannel = supabase
      .channel('virtual-cards-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'virtual_cards', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVirtualCards(current => [payload.new as VirtualCard, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setVirtualCards(current => current.map(card => 
              card.id === payload.new.id ? payload.new as VirtualCard : card
            ));
          } else if (payload.eventType === 'DELETE') {
            setVirtualCards(current => current.filter(card => card.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(virtualCardsChannel);
    };
  }, [user, toast]);

  // Generate a new virtual card
  const generateVirtualCard = async (initialBalance: number) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou jenere yon kat vityèl.",
        variant: "destructive"
      });
      return { success: false };
    }

    if (initialBalance <= 0) {
      toast({
        title: "Montan envalid",
        description: "Balans inisyal la dwe pi plis ke zewo.",
        variant: "destructive"
      });
      return { success: false };
    }

    setCreating(true);
    try {
      // Generate card details
      // Note: In a real app, this would be more secure and handled on the server
      const cardNumber = `4242${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Generate expiration (3 months from now)
      const expDate = new Date();
      expDate.setMonth(expDate.getMonth() + 3);
      const expiration = `${(expDate.getMonth() + 1).toString().padStart(2, '0')}/${expDate.getFullYear().toString().slice(-2)}`;
      
      // Generate CVV
      const cvv = Math.floor(100 + Math.random() * 900).toString();

      // Create the virtual card
      const { data, error } = await supabase
        .from('virtual_cards')
        .insert({
          user_id: user.id,
          card_number: cardNumber,
          expiration,
          cvv,
          balance: initialBalance,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating virtual card:', error);
        toast({
          title: "Erè",
          description: "Nou pa kapab kreye kat vityèl la. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Also need to deduct the balance from the user's account
      // This would need a transaction in a real app to ensure consistency

      toast({
        title: "Siksè",
        description: "Kat vityèl kreye avèk siksè.",
      });
      return { success: true, card: data as VirtualCard };
    } catch (error) {
      console.error('Error in generateVirtualCard:', error);
      toast({
        title: "Erè",
        description: "Gen yon erè ki pase pandan n ap eseye kreye kat vityèl la.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setCreating(false);
    }
  };

  // Toggle card activation status
  const toggleCardStatus = async (cardId: string, activate: boolean) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou chanje estati kat la.",
        variant: "destructive"
      });
      return { success: false };
    }

    try {
      const { data, error } = await supabase
        .from('virtual_cards')
        .update({ is_active: activate })
        .eq('id', cardId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating card status:', error);
        toast({
          title: "Erè",
          description: `Nou pa kapab ${activate ? 'aktive' : 'dezaktive'} kat la. Tanpri eseye ankò.`,
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Siksè",
        description: `Kat la ${activate ? 'aktive' : 'dezaktive'} avèk siksè.`,
      });
      return { success: true, card: data as VirtualCard };
    } catch (error) {
      console.error('Error in toggleCardStatus:', error);
      toast({
        title: "Erè",
        description: `Gen yon erè ki pase pandan n ap eseye ${activate ? 'aktive' : 'dezaktive'} kat la.`,
        variant: "destructive"
      });
      return { success: false };
    }
  };

  // Simulate a card transaction
  const simulateTransaction = async (cardId: string, amount: number, description: string) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou fè yon tranzaksyon.",
        variant: "destructive"
      });
      return { success: false };
    }

    if (amount <= 0) {
      toast({
        title: "Montan envalid",
        description: "Montan tranzaksyon an dwe pi plis ke zewo.",
        variant: "destructive"
      });
      return { success: false };
    }

    try {
      // First check if the card is active and has enough balance
      const { data: cardData, error: cardError } = await supabase
        .from('virtual_cards')
        .select('*')
        .eq('id', cardId)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (cardError || !cardData) {
        console.error('Error fetching card:', cardError);
        toast({
          title: "Erè",
          description: "Nou pa kapab jwenn kat la oswa kat la pa aktif.",
          variant: "destructive"
        });
        return { success: false };
      }

      const card = cardData as VirtualCard;
      
      // Check expiration
      const [month, year] = card.expiration.split('/');
      const expDate = new Date(parseInt(`20${year}`), parseInt(month) - 1, 1);
      expDate.setMonth(expDate.getMonth() + 1); // Last day of the month
      expDate.setDate(0);
      
      if (expDate < new Date()) {
        toast({
          title: "Kat ekspire",
          description: "Kat sa a ekspire. Tanpri jenere yon nouvo kat.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Check balance
      if (card.balance < amount) {
        toast({
          title: "Balans ensifizan",
          description: "Ou pa gen ase lajan nan kat la pou fè tranzaksyon sa a.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Update card balance
      const { data: updatedCard, error: updateError } = await supabase
        .from('virtual_cards')
        .update({ balance: card.balance - amount })
        .eq('id', cardId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating card balance:', updateError);
        toast({
          title: "Erè",
          description: "Nou pa kapab mete ajou balans kat la. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Create a transaction record 
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: cardId, // Using card ID as account ID
          transaction_type: 'payment',
          amount: amount,
          description: description
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        // We still consider the transaction successful even if transaction recording fails
      }

      toast({
        title: "Tranzaksyon reyisi",
        description: `Ou te peye $${amount} pou "${description}".`,
      });
      
      return { success: true, card: updatedCard as VirtualCard };
    } catch (error) {
      console.error('Error in simulateTransaction:', error);
      toast({
        title: "Erè",
        description: "Gen yon erè ki pase pandan n ap eseye fè tranzaksyon an.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  return {
    virtualCards,
    loading,
    creating,
    generateVirtualCard,
    toggleCardStatus,
    simulateTransaction
  };
};
