
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useBankOperations = () => {
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const createBankAccount = async (accountName: string, accountType: string) => {
    if (!user) {
      toast({
        title: "Erè",
        description: "Ou dwe konekte pou kreye yon kont",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      setIsProcessing(true);

      // Generate a random account number
      const accountNumber = 'ACCT-' + Math.random().toString(36).substring(2, 10).toUpperCase();

      const { error } = await supabase
        .from('bank_accounts')
        .insert([{
          user_id: user.id,
          account_name: accountName,
          account_type: accountType,
          account_number: accountNumber,
          balance: 0.00,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Kont kreye",
        description: `Ou kreye yon nouvo kont ${accountType}: ${accountName}`,
      });

      // Refresh profile to get updated account list
      await refreshProfile();
      
      return { success: true };
    } catch (error: any) {
      console.error("Error creating bank account:", error);
      toast({
        title: "Erè",
        description: error.message || "Pa kapab kreye kont. Tanpri eseye ankò.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  };

  const processTransaction = async (
    accountId: string,
    type: 'deposit' | 'withdrawal',
    amount: number,
    description: string = ''
  ) => {
    if (!user) {
      toast({
        title: "Erè",
        description: "Ou dwe konekte pou fè yon tranzaksyon",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      setIsProcessing(true);

      // Get the current account balance
      const { data: accountData, error: accountError } = await supabase
        .from('bank_accounts')
        .select('balance')
        .eq('id', accountId)
        .eq('user_id', user.id)
        .single();

      if (accountError) {
        throw accountError;
      }

      if (!accountData) {
        throw new Error("Kont pa jwenn");
      }

      let newBalance = accountData.balance;

      // Calculate new balance based on transaction type
      if (type === 'deposit') {
        newBalance += amount;
      } else if (type === 'withdrawal') {
        if (accountData.balance < amount) {
          throw new Error("Balans ensifizan");
        }
        newBalance -= amount;
      }

      // Begin a transaction
      // First, create the transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          account_id: accountId,
          transaction_type: type,
          amount: amount,
          description: description,
          created_at: new Date().toISOString(),
        }]);

      if (transactionError) {
        throw transactionError;
      }

      // Then, update the account balance
      const { error: updateError } = await supabase
        .from('bank_accounts')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: type === 'deposit' ? "Depo reyisi" : "Retrè reyisi",
        description: `${type === 'deposit' ? 'Ou depoze' : 'Ou retire'} $${amount}`,
      });

      // Refresh profile to get updated account list
      await refreshProfile();
      
      return { success: true };
    } catch (error: any) {
      console.error("Error processing transaction:", error);
      toast({
        title: "Erè",
        description: error.message || "Pa kapab konplete tranzaksyon an. Tanpri eseye ankò.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    createBankAccount,
    processTransaction,
    isProcessing
  };
};
