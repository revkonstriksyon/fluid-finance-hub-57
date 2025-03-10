
import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import { supabase } from "@/lib/supabase";
import { BankAccount as AuthBankAccount, Transaction as AuthTransaction } from "@/types/auth";

export interface BankAccount extends AuthBankAccount {
  id: string;
  user_id: string;
  account_name: string;
  account_number: string;
  balance: number;
  account_type: string;
  currency: string;
  is_primary: boolean;
  created_at: string;
}

export interface Transaction extends AuthTransaction {
  id: string;
  user_id: string;
  account_id: string;
  transaction_type: string;
  amount: number;
  description?: string;
  status: string;
  created_at: string;
  reference_id?: string;
}

export const useBankData = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBankAccounts = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setAccounts(data || []);
      return data;
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your bank accounts. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (accountId?: string) => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("User not authenticated");
      }

      let query = supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      // If accountId is provided, filter transactions for that account
      if (accountId) {
        query = query.eq("account_id", accountId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setTransactions(data || []);
      return data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your transactions. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchBankAccounts();
    fetchTransactions();
  }, []);

  return {
    accounts,
    transactions,
    loading,
    fetchBankAccounts,
    fetchTransactions,
  };
};
