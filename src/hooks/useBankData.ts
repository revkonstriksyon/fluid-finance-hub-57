
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Transaction, BankAccount } from '@/types/auth';

export const useBankData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bank accounts and transactions
  useEffect(() => {
    if (!user) return;

    const fetchBankData = async () => {
      setLoading(true);
      try {
        // Fetch bank accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('bank_accounts')
          .select('*')
          .eq('user_id', user.id)
          .order('is_primary', { ascending: false });

        if (accountsError) {
          console.error('Error fetching accounts:', accountsError);
          toast({
            title: "Erè nan jwenn kont yo",
            description: "Nou pa kapab jwenn enfòmasyon kont ou yo pou kounye a.",
            variant: "destructive"
          });
        } else {
          setAccounts(accountsData as BankAccount[]);
        }

        // Fetch recent transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (transactionsError) {
          console.error('Error fetching transactions:', transactionsError);
          toast({
            title: "Erè nan jwenn tranzaksyon yo",
            description: "Nou pa kapab jwenn istwa tranzaksyon ou yo pou kounye a.",
            variant: "destructive"
          });
        } else {
          setTransactions(transactionsData as Transaction[]);
        }
      } catch (error) {
        console.error('Error in fetchBankData:', error);
        toast({
          title: "Erè nan kominikasyon",
          description: "Gen yon erè ki pase pandan nou t ap jwenn enfòmasyon bank ou yo.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBankData();

    // Set up real-time subscription for bank accounts and transactions
    const accountsChannel = supabase
      .channel('bank-accounts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bank_accounts', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAccounts(current => [...current, payload.new as BankAccount]);
          } else if (payload.eventType === 'UPDATE') {
            setAccounts(current => current.map(account => 
              account.id === payload.new.id ? payload.new as BankAccount : account
            ));
          } else if (payload.eventType === 'DELETE') {
            setAccounts(current => current.filter(account => account.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTransactions(current => [payload.new as Transaction, ...current.slice(0, 9)]);
          } else if (payload.eventType === 'UPDATE') {
            setTransactions(current => current.map(transaction => 
              transaction.id === payload.new.id ? payload.new as Transaction : transaction
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(accountsChannel);
      supabase.removeChannel(transactionsChannel);
    };
  }, [user, toast]);

  return {
    accounts,
    transactions,
    loading
  };
};
