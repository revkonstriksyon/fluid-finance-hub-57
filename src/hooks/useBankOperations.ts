
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
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
      // Create a transaction record for the deposit
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: accountId,
          transaction_type: 'deposit',
          amount: amount,
          method: method,
          description: description || `Depo via ${method}`,
          status: 'completed'
        })
        .select()
        .single();

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
      
      return { success: true, transaction: transactionData as Transaction };
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
    description?: string
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
      
      // Create the "sent" transaction for the sender
      const { data: sentTransactionData, error: sentTransactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: fromAccountId,
          transaction_type: 'transfer_sent',
          amount: amount,
          description: description || 'Transfè voye',
          status: 'completed',
          reference_id: null // Will be updated after the received transaction is created
        })
        .select()
        .single();

      if (sentTransactionError) {
        console.error('Error creating sent transaction:', sentTransactionError);
        toast({
          title: "Transfè echwe",
          description: "Nou pa t kapab trete transfè ou a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      // If we're transferring to another user and we have their account ID
      if (receiverId !== user.id && receiverAccountId) {
        // Create a "received" transaction for the recipient
        const { data: receivedTransactionData, error: receivedTransactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: receiverId,
            account_id: receiverAccountId,
            transaction_type: 'transfer_received',
            amount: amount,
            description: `Transfè resevwa de ${user.email}`,
            status: 'completed',
            reference_id: sentTransactionData.id
          })
          .select()
          .single();

        if (receivedTransactionError) {
          console.error('Error creating received transaction:', receivedTransactionError);
          // Continue even if this fails, main transaction went through
        } else {
          // Update the sent transaction with the reference to the received transaction
          await supabase
            .from('transactions')
            .update({ reference_id: receivedTransactionData.id })
            .eq('id', sentTransactionData.id);
        }
      }

      toast({
        title: "Transfè reyisi",
        description: `Ou voye $${amount} bay kont destinasyon an.`,
      });
      
      return { success: true, transaction: sentTransactionData as Transaction };
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

  const payBill = async (accountId: string, provider: string, billType: string, accountNumber: string, amount: number) => {
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
      
      // Create a bill record
      const { data: billData, error: billError } = await supabase
        .from('bills')
        .insert({
          user_id: user.id,
          type: billType,
          amount: amount,
          bill_number: accountNumber,
          paid_at: new Date().toISOString()
        })
        .select()
        .single();

      if (billError) {
        console.error('Error creating bill record:', billError);
        toast({
          title: "Peman echwe",
          description: "Nou pa t kapab anrejistre fakti a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Create a transaction record for the payment
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: accountId,
          transaction_type: 'payment',
          amount: amount,
          description: `Peman ${provider} - Kont #${accountNumber}`,
          status: 'completed',
          reference_id: billData.id
        })
        .select()
        .single();

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
      
      return { success: true, transaction: transactionData as Transaction };
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

      // Create a transaction record for account creation
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: accountData.id,
          transaction_type: 'deposit', // We'll use deposit as the type for account creation
          amount: 0, // No monetary value for account creation
          description: `Kreyasyon kont ${accountType}: ${accountName}`,
          status: 'completed'
        });
        
      if (transactionError) {
        console.error('Error creating account creation transaction:', transactionError);
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
