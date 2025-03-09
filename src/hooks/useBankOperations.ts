
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BankAccount, Transaction } from '@/types/auth';

export const useBankOperations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [processingDeposit, setProcessingDeposit] = useState(false);
  const [processingTransfer, setProcessingTransfer] = useState(false);
  const [processingBill, setProcessingBill] = useState(false);
  const [processingAddAccount, setProcessingAddAccount] = useState(false);

  const makeDeposit = async (accountId: string, amount: number, method: string, description?: string) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou fè yon depo.",
        variant: "destructive"
      });
      return { success: false };
    }

    if (amount <= 0) {
      toast({
        title: "Montan envalid",
        description: "Montan depo a dwe pi plis ke zewo.",
        variant: "destructive"
      });
      return { success: false };
    }

    setProcessingDeposit(true);
    try {
      // Call the create_transaction database function to ensure atomic operation
      const { data: transactionData, error: transactionError } = await supabase
        .rpc('create_transaction', {
          p_user_id: user.id,
          p_account_id: accountId,
          p_transaction_type: 'deposit',
          p_amount: amount,
          p_description: description || `Depo via ${method}`
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        toast({
          title: "Depo echwe",
          description: "Nou pa t kapab trete depo ou a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Depo reyisi",
        description: `Ou depoze $${amount} nan kont ou`,
      });
      
      return { success: true, transactionId: transactionData };
    } catch (error) {
      console.error('Error in makeDeposit:', error);
      toast({
        title: "Depo echwe",
        description: "Gen yon erè ki pase pandan n ap eseye fè depo a.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setProcessingDeposit(false);
    }
  };

  const makeTransfer = async (
    fromAccountId: string, 
    toUserId: string | null, 
    toAccountId: string | null,
    amount: number, 
    description: string,
    purpose?: string
  ) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou fè yon transfè.",
        variant: "destructive"
      });
      return { success: false };
    }

    if (amount <= 0) {
      toast({
        title: "Montan envalid",
        description: "Montan transfè a dwe pi plis ke zewo.",
        variant: "destructive"
      });
      return { success: false };
    }

    setProcessingTransfer(true);
    try {
      // Get current account balance
      const { data: accountData, error: accountError } = await supabase
        .from('bank_accounts')
        .select('balance')
        .eq('id', fromAccountId)
        .eq('user_id', user.id)
        .single();

      if (accountError || !accountData) {
        console.error('Error fetching account balance:', accountError);
        toast({
          title: "Transfè echwe",
          description: "Nou pa t kapab verifye balans ou. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      if (accountData.balance < amount) {
        toast({
          title: "Balans ensifizan",
          description: "Ou pa gen ase lajan nan kont la pou fè transfè sa a.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Use a database transaction to ensure atomicity
      const { data: result, error: transferError } = await supabase.rpc('transfer_funds', { 
        p_sender_account_id: fromAccountId,
        p_receiver_id: toUserId,
        p_receiver_account_id: toAccountId,
        p_amount: amount,
        p_description: description,
        p_purpose: purpose || 'transfer'
      });

      if (transferError) {
        console.error('Error in transfer_funds:', transferError);
        toast({
          title: "Transfè echwe",
          description: transferError.message || "Nou pa t kapab konplete transfè a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Transfè reyisi",
        description: `Ou voye $${amount} bay destinasyon an.`,
      });
      
      return { success: true, transactionId: result };
    } catch (error) {
      console.error('Error in makeTransfer:', error);
      toast({
        title: "Transfè echwe",
        description: "Gen yon erè ki pase pandan n ap eseye fè transfè a.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setProcessingTransfer(false);
    }
  };

  const payBill = async (accountId: string, provider: string, billNumber: string, amount: number) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou peye yon bòdwo.",
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

    setProcessingBill(true);
    try {
      // Start a Supabase transaction
      // First, deduct money from the account
      const { data: transaction, error: transactionError } = await supabase.rpc('create_transaction', {
        p_user_id: user.id,
        p_account_id: accountId,
        p_transaction_type: 'payment',
        p_amount: amount,
        p_description: `Peman ${provider} - Kont #${billNumber}`
      });

      if (transactionError) {
        console.error('Error creating payment transaction:', transactionError);
        toast({
          title: "Peman echwe",
          description: "Nou pa t kapab trete peman ou a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Create a bill record
      const { data: billData, error: billError } = await supabase
        .from('bills')
        .insert({
          user_id: user.id,
          type: provider as any,
          amount: amount,
          bill_number: billNumber,
          paid_at: new Date().toISOString()
        })
        .select()
        .single();

      if (billError) {
        console.error('Error creating bill record:', billError);
        // Since the transaction has already completed, we don't revert it
        // but we do notify the user
        toast({
          title: "Peman reyisi, men gen erè",
          description: "Peman an te fèt, men nou pa t kapab anrejistre fakti a.",
          variant: "warning"
        });
        return { success: true, transaction };
      }

      toast({
        title: "Peman reyisi",
        description: `Ou peye $${amount} pou ${provider}.`,
      });
      
      return { success: true, transaction, bill: billData };
    } catch (error) {
      console.error('Error in payBill:', error);
      toast({
        title: "Peman echwe",
        description: "Gen yon erè ki pase pandan n ap eseye fè peman an.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setProcessingBill(false);
    }
  };

  const addAccount = async (accountName: string, accountType: string) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou kreye yon kont.",
        variant: "destructive"
      });
      return { success: false };
    }

    setProcessingAddAccount(true);
    try {
      // Generate a random account number
      const accountNumber = `ACCT-${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`;
      
      // Check if this will be the first account (should be primary)
      const { count, error: countError } = await supabase
        .from('bank_accounts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      if (countError) {
        console.error('Error checking existing accounts:', countError);
      }
      
      const isPrimary = count === 0;

      // Create the account
      const { data: accountData, error: accountError } = await supabase
        .from('bank_accounts')
        .insert({
          user_id: user.id,
          account_name: accountName,
          account_number: accountNumber,
          account_type: accountType,
          balance: 0, // Start with zero balance
          is_primary: isPrimary,
          currency: 'USD'
        })
        .select()
        .single();

      if (accountError) {
        console.error('Error creating account:', accountError);
        toast({
          title: "Kreyasyon kont echwe",
          description: "Nou pa t kapab kreye kont ou a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Kont kreye",
        description: `Ou kreye yon nouvo kont ${accountType}: ${accountName}`,
      });
      
      return { success: true, account: accountData as BankAccount };
    } catch (error) {
      console.error('Error in addAccount:', error);
      toast({
        title: "Kreyasyon kont echwe",
        description: "Gen yon erè ki pase pandan n ap eseye kreye kont lan.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setProcessingAddAccount(false);
    }
  };

  return {
    makeDeposit,
    makeTransfer,
    payBill,
    addAccount,
    processingDeposit,
    processingTransfer,
    processingBill,
    processingAddAccount
  };
};
