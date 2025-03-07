
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BankAccount } from './useBankData';

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
      // Create a deposit
      const { data: depositData, error: depositError } = await supabase
        .from('deposits')
        .insert({
          user_id: user.id,
          account_id: accountId,
          amount,
          deposit_method: method,
          description,
          status: 'completed'
        })
        .select()
        .single();

      if (depositError) {
        console.error('Error creating deposit:', depositError);
        toast({
          title: "Depo echwe",
          description: "Nou pa t kapab trete depo ou a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Create a transaction record for the deposit
      const { data: transactionData, error: transactionError } = await supabase
        .rpc('create_transaction', {
          p_user_id: user.id,
          p_account_id: accountId,
          p_transaction_type: 'deposit',
          p_amount: amount,
          p_description: description || `Depo via ${method}`,
          p_reference_id: depositData.id
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        // We still consider the deposit successful even if transaction recording fails
      }

      toast({
        title: "Depo reyisi",
        description: `Ou depoze $${amount} nan kont ou`,
      });
      
      return { success: true, depositId: depositData.id };
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
    description?: string, 
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

      // Find a valid account to receive the transfer
      let receiverAccountId = toAccountId;
      
      // If no specific account ID was provided but we have a user ID, 
      // try to find their primary account
      if (!receiverAccountId && toUserId) {
        const { data: receiverAccounts, error: receiverError } = await supabase
          .from('bank_accounts')
          .select('id')
          .eq('user_id', toUserId)
          .eq('is_primary', true)
          .single();
          
        if (!receiverError && receiverAccounts) {
          receiverAccountId = receiverAccounts.id;
        } else {
          // Try to get any account if primary not found
          const { data: anyAccount, error: anyAccountError } = await supabase
            .from('bank_accounts')
            .select('id')
            .eq('user_id', toUserId)
            .limit(1)
            .single();
            
          if (!anyAccountError && anyAccount) {
            receiverAccountId = anyAccount.id;
          }
        }
      }
      
      // Default to sending to another user if no specific toAccountId is provided
      const receiverId = toUserId || user.id;
      
      // Create a transfer record
      const { data: transferData, error: transferError } = await supabase
        .from('transfers')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          sender_account_id: fromAccountId,
          receiver_account_id: receiverAccountId,
          amount,
          description: description || '',
          reference: purpose || 'General transfer',
          status: 'completed'
        })
        .select()
        .single();

      if (transferError) {
        console.error('Error creating transfer:', transferError);
        toast({
          title: "Transfè echwe",
          description: "Nou pa t kapab trete transfè ou a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Create a transaction record for the sender (withdrawal)
      const { data: senderTransactionData, error: senderTransactionError } = await supabase
        .rpc('create_transaction', {
          p_user_id: user.id,
          p_account_id: fromAccountId,
          p_transaction_type: 'transfer_sent',
          p_amount: amount,
          p_description: description || `Transfè voye`,
          p_reference_id: transferData.id
        });

      if (senderTransactionError) {
        console.error('Error creating sender transaction:', senderTransactionError);
      }

      // If we're transferring to another user and we have their account ID
      if (receiverId !== user.id && receiverAccountId) {
        // Create a transaction record for the receiver (deposit)
        const { data: receiverTransactionData, error: receiverTransactionError } = await supabase
          .rpc('create_transaction', {
            p_user_id: receiverId,
            p_account_id: receiverAccountId,
            p_transaction_type: 'transfer_received',
            p_amount: amount,
            p_description: `Transfè resevwa de ${user.email}`,
            p_reference_id: transferData.id
          });

        if (receiverTransactionError) {
          console.error('Error creating receiver transaction:', receiverTransactionError);
        }
      }

      toast({
        title: "Transfè reyisi",
        description: `Ou voye $${amount} bay kont destinasyon an.`,
      });
      
      return { success: true, transferId: transferData.id };
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

  const payBill = async (accountId: string, provider: string, accountNumber: string, amount: number) => {
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

      if (accountData.balance < amount) {
        toast({
          title: "Balans ensifizan",
          description: "Ou pa gen ase lajan nan kont la pou fè peman sa a.",
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
          p_description: `Peman ${provider} - Kont #${accountNumber}`
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
        description: `Ou peye $${amount} pou ${provider}.`,
      });
      
      return { success: true, transactionId: transactionData };
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
          is_primary: isPrimary
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
