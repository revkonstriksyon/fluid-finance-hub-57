
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Bill, BankAccount } from '@/types/auth';

export const useBillPayments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Fetch bills
  useEffect(() => {
    if (!user) return;

    const fetchBills = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('bills')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching bills:', error);
          toast({
            title: "Erè nan jwenn fakti yo",
            description: "Nou pa kapab jwenn fakti ou yo pou kounye a.",
            variant: "destructive"
          });
        } else {
          setBills(data as Bill[]);
        }
      } catch (error) {
        console.error('Error in fetchBills:', error);
        toast({
          title: "Erè nan kominikasyon",
          description: "Gen yon erè ki pase pandan nou t ap jwenn fakti ou yo.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBills();

    // Set up real-time subscription for bills
    const billsChannel = supabase
      .channel('bills-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bills', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBills(current => [payload.new as Bill, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setBills(current => current.map(bill => 
              bill.id === payload.new.id ? payload.new as Bill : bill
            ));
          } else if (payload.eventType === 'DELETE') {
            setBills(current => current.filter(bill => bill.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(billsChannel);
    };
  }, [user, toast]);

  // Pay a bill
  const payBill = async (
    accountId: string,
    billType: 'electricity' | 'water' | 'rent' | 'internet',
    billNumber: string,
    amount: number,
    provider?: string
  ) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou peye yon fakti.",
        variant: "destructive"
      });
      return { success: false };
    }

    if (amount <= 0) {
      toast({
        title: "Montan envalid",
        description: "Montan peman an dwe pi plis ke zewo.",
        variant: "destructive"
      });
      return { success: false };
    }

    setProcessing(true);
    try {
      // Get current account balance
      const { data: accountData, error: accountError } = await supabase
        .from('bank_accounts')
        .select('balance')
        .eq('id', accountId)
        .eq('user_id', user.id)
        .single();

      if (accountError || !accountData) {
        console.error('Error fetching account balance:', accountError);
        toast({
          title: "Peman echwe",
          description: "Nou pa t kapab verifye balans ou. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      const account = accountData as BankAccount;

      if (account.balance < amount) {
        toast({
          title: "Balans ensifizan",
          description: "Ou pa gen ase lajan nan kont la pou fè peman sa a.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Create a bill record
      const { data: billData, error: billError } = await supabase
        .from('bills')
        .insert({
          user_id: user.id,
          type: billType,
          amount,
          bill_number: billNumber,
          paid_at: new Date().toISOString()
        })
        .select()
        .single();

      if (billError) {
        console.error('Error creating bill:', billError);
        toast({
          title: "Peman echwe",
          description: "Nou pa t kapab anrejistre fakti a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Create a transaction record for the payment
      const { data: transactionData, error: transactionError } = await supabase
        .rpc('create_transaction', {
          p_user_id: user.id,
          p_account_id: accountId,
          p_transaction_type: 'payment',
          p_amount: amount,
          p_description: `Peman ${provider || billType} - Fakti #${billNumber}`
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        toast({
          title: "Peman echwe",
          description: "Nou pa t kapab trete peman ou a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Peman reyisi",
        description: `Ou peye $${amount} pou ${provider || billType}.`,
      });
      
      return { success: true, bill: billData as Bill };
    } catch (error) {
      console.error('Error in payBill:', error);
      toast({
        title: "Peman echwe",
        description: "Gen yon erè ki pase pandan n ap eseye fè peman an.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setProcessing(false);
    }
  };

  // Get recent unpaid bills
  const getRecentUnpaidBills = async (billType: 'electricity' | 'water' | 'rent' | 'internet') => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', billType)
        .is('paid_at', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching unpaid bills:', error);
        return [];
      }

      return data as Bill[];
    } catch (error) {
      console.error('Error in getRecentUnpaidBills:', error);
      return [];
    }
  };

  return {
    bills,
    loading,
    processing,
    payBill,
    getRecentUnpaidBills
  };
};
