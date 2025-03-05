
import { supabase } from '@/lib/supabase';
import { AccountFormValues } from '../schemas/accountFormSchema';

export const createBankAccount = async (userId: string, values: AccountFormValues) => {
  // Generate a random account number
  const accountNumber = `ACCT-${Math.floor(Math.random() * 90000) + 10000}`;
  
  // 1. Create the new bank account with 0 balance by default
  const { data: accountData, error: accountError } = await supabase
    .from('bank_accounts')
    .insert({
      user_id: userId,
      account_name: values.accountName,
      account_type: values.accountType,
      account_number: accountNumber,
      balance: values.initialDeposit || 0, // Use initialDeposit if provided, otherwise 0
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (accountError) throw accountError;

  // 2. If initial deposit is greater than 0, create a transaction record
  if (values.initialDeposit > 0) {
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        amount: values.initialDeposit,
        transaction_type: 'deposit',
        description: 'Depo inisyal',
        account_id: accountData.id,
        user_id: userId,
      });

    if (transactionError) throw transactionError;
  }
  
  return accountData;
};
