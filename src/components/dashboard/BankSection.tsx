
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const BankSection = () => {
  const { user, bankAccounts, refreshProfile } = useAuth();
  const { transactions, loading: transactionsLoading, addTransaction } = useTransactions(user?.id);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [amount, setAmount] = useState(0);
  const { toast } = useToast();

  const handleDeposit = async () => {
    if (amount <= 0) {
      toast({
        title: "Erè",
        description: "Antre yon montan ki pozitif.",
        variant: "destructive"
      });
      return;
    }

    if (bankAccounts.length === 0) {
      toast({
        title: "Erè",
        description: "Ou pa gen okenn kont labank.",
        variant: "destructive"
      });
      return;
    }

    setIsDepositing(true);
    try {
      // 1. First update the bank account balance
      const accountId = bankAccounts[0].id;
      const { error: balanceError } = await supabase
        .from('bank_accounts')
        .update({ 
          balance: bankAccounts[0].balance + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId);

      if (balanceError) throw balanceError;

      // 2. Then create a transaction record
      await addTransaction({
        amount,
        transaction_type: 'deposit',
        description: 'Depo',
        account_id: accountId,
        user_id: user!.id
      });

      // 3. Refresh profile to get updated accounts
      await refreshProfile();
      
      // Reset form
      setAmount(0);
    } catch (error: any) {
      console.error('Error depositing:', error);
      toast({
        title: "Erè depo",
        description: error.message || "Pa kapab fè depo a. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (amount <= 0) {
      toast({
        title: "Erè",
        description: "Antre yon montan ki pozitif.",
        variant: "destructive"
      });
      return;
    }

    if (bankAccounts.length === 0) {
      toast({
        title: "Erè",
        description: "Ou pa gen okenn kont labank.",
        variant: "destructive"
      });
      return;
    }

    if (amount > bankAccounts[0].balance) {
      toast({
        title: "Erè",
        description: "Ou pa gen ase lajan nan kont ou a.",
        variant: "destructive"
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      // 1. First update the bank account balance
      const accountId = bankAccounts[0].id;
      const { error: balanceError } = await supabase
        .from('bank_accounts')
        .update({ 
          balance: bankAccounts[0].balance - amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId);

      if (balanceError) throw balanceError;

      // 2. Then create a transaction record
      await addTransaction({
        amount: -amount, // Negative for withdrawal
        transaction_type: 'withdrawal',
        description: 'Retrè',
        account_id: accountId,
        user_id: user!.id
      });

      // 3. Refresh profile to get updated accounts
      await refreshProfile();
      
      // Reset form
      setAmount(0);
    } catch (error: any) {
      console.error('Error withdrawing:', error);
      toast({
        title: "Erè retrè",
        description: error.message || "Pa kapab fè retrè a. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bank Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Kont Labank Ou</CardTitle>
        </CardHeader>
        <CardContent>
          {bankAccounts.length > 0 ? (
            <div className="space-y-4">
              {bankAccounts.map(account => (
                <div key={account.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium text-lg">{account.account_name}</h3>
                  <p className="text-muted-foreground">Nimewo: {account.account_number}</p>
                  <p className="text-2xl font-bold mt-2">
                    {account.currency} {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Ou pa gen okenn kont labank.</p>
          )}
        </CardContent>
      </Card>

      {/* Deposit/Withdraw */}
      <Card>
        <CardHeader>
          <CardTitle>Fè Tranzaksyon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-muted-foreground">
                Montan (HTG)
              </label>
              <input
                id="amount"
                type="number"
                min="0"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={handleDeposit} 
                className="flex-1" 
                disabled={isDepositing || amount <= 0 || !user}
              >
                {isDepositing ? "Ap depoze..." : "Depoze"}
              </Button>
              <Button 
                onClick={handleWithdraw} 
                className="flex-1" 
                variant="outline"
                disabled={isWithdrawing || amount <= 0 || !user || (bankAccounts.length > 0 && amount > bankAccounts[0].balance)}
              >
                {isWithdrawing ? "Ap retire..." : "Retire"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Resan Tranzaksyon</CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <p className="text-center">Ap chaje tranzaksyon yo...</p>
          ) : transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.slice(0, 10).map(transaction => (
                <div key={transaction.id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{transaction.description || (transaction.amount > 0 ? 'Depo' : 'Retrè')}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <p className={transaction.amount > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} HTG
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Pa gen okenn tranzaksyon nan istwa ou.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BankSection;
