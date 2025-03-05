
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

export interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  description?: string;
  created_at: string;
  account_id: string;
  user_id: string;
}

export const useTransactions = (userId?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchTransactions(userId);
    }
  }, [userId]);

  const fetchTransactions = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error.message);
      toast({
        title: "Erè chajman tranzaksyon yo",
        description: "Pa kapab jwenn istwa tranzaksyon ou yo. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setTransactions(prev => [data as Transaction, ...prev]);
      
      toast({
        title: "Tranzaksyon ajoute",
        description: "Tranzaksyon ou an te anrejistre avèk siksè.",
      });
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding transaction:', error.message);
      toast({
        title: "Erè tranzaksyon",
        description: "Pa kapab ajoute tranzaksyon an. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  return { transactions, loading, fetchTransactions, addTransaction };
};
