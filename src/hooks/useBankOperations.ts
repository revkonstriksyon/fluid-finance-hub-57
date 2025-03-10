
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

export const useBankOperations = () => {
  const { toast } = useToast();
  const [processingDeposit, setProcessingDeposit] = useState(false);
  const [processingTransfer, setProcessingTransfer] = useState(false);
  const [processingBill, setProcessingBill] = useState(false);
  const [processingAddAccount, setProcessingAddAccount] = useState(false);

  const makeDeposit = async (accountId: string, amount: number, method: string, description: string) => {
    try {
      setProcessingDeposit(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.rpc('create_transaction', {
        p_user_id: userData.user.id,
        p_account_id: accountId,
        p_transaction_type: 'deposit',
        p_amount: amount,
        p_description: `Deposit via ${method}: ${description}`
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Deposit successful",
        description: `Successfully deposited $${amount} to your account.`
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error making deposit:', error);
      toast({
        title: "Deposit failed",
        description: "Could not complete the deposit. Please try again.",
        variant: "destructive"
      });
      return { success: false, error };
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
    purpose: string
  ) => {
    try {
      setProcessingTransfer(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // First create the outgoing transaction
      const { data: outgoingTx, error: outgoingError } = await supabase.rpc('create_transaction', {
        p_user_id: userData.user.id,
        p_account_id: fromAccountId,
        p_transaction_type: 'transfer_sent',
        p_amount: amount,
        p_description: `${description} (${purpose})`,
      });

      if (outgoingError) {
        throw outgoingError;
      }

      // If transferring to another user
      if (toUserId) {
        // Find the user's primary account
        const { data: recipientAccounts, error: recipientError } = await supabase
          .from('bank_accounts')
          .select('*')
          .eq('user_id', toUserId);

        if (recipientError) {
          throw recipientError;
        }

        const recipientAccount = recipientAccounts[0];

        // Create the incoming transaction for the recipient
        const { error: incomingError } = await supabase.rpc('create_transaction', {
          p_user_id: toUserId,
          p_account_id: recipientAccount.id,
          p_transaction_type: 'transfer_received',
          p_amount: amount,
          p_description: `Received from ${userData.user.email || 'another user'} (${purpose})`,
          p_reference_id: outgoingTx
        });

        if (incomingError) {
          throw incomingError;
        }
      }

      toast({
        title: "Transfer successful",
        description: `Successfully transferred $${amount}.`
      });

      return { success: true };
    } catch (error) {
      console.error('Error making transfer:', error);
      toast({
        title: "Transfer failed",
        description: "Could not complete the transfer. Please try again.",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setProcessingTransfer(false);
    }
  };

  const payBill = async (accountId: string, provider: string, billAccount: string, amount: number) => {
    try {
      setProcessingBill(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // First create the payment transaction
      const { data: paymentTx, error: paymentError } = await supabase.rpc('create_transaction', {
        p_user_id: userData.user.id,
        p_account_id: accountId,
        p_transaction_type: 'payment',
        p_amount: amount,
        p_description: `Bill payment to ${provider} for account ${billAccount}`,
      });

      if (paymentError) {
        throw paymentError;
      }

      // Add bill record
      const { error: billError } = await supabase
        .from('bills')
        .insert([{
          user_id: userData.user.id,
          type: provider.toLowerCase(),
          amount: amount,
          bill_number: billAccount,
          paid_at: new Date().toISOString()
        }]);

      if (billError) {
        throw billError;
      }

      toast({
        title: "Payment successful",
        description: `Successfully paid $${amount} to ${provider}.`
      });

      return { success: true };
    } catch (error) {
      console.error('Error paying bill:', error);
      toast({
        title: "Payment failed",
        description: "Could not complete the payment. Please try again.",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setProcessingBill(false);
    }
  };

  const addAccount = async (accountName: string, accountType: string) => {
    try {
      setProcessingAddAccount(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Generate an account number
      const accountNumber = `ACCT-${Math.floor(100000 + Math.random() * 900000)}`;

      // Add the account
      const { data, error } = await supabase
        .from('bank_accounts')
        .insert([{
          user_id: userData.user.id,
          account_name: accountName,
          account_number: accountNumber,
          account_type: accountType,
          balance: 0,
          currency: 'HTG',
          is_primary: false
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Account created",
        description: `Successfully created ${accountName} account.`
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error adding account:', error);
      toast({
        title: "Account creation failed",
        description: "Could not create the account. Please try again.",
        variant: "destructive"
      });
      return { success: false, error };
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
