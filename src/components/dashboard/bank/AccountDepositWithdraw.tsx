
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { BankAccount } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useTransactions } from '@/hooks/useTransactions';

interface AccountDepositWithdrawProps {
  account: BankAccount;
  user: User | null;
  refreshProfile: () => Promise<void>;
}

const AccountDepositWithdraw = ({ account, user, refreshProfile }: AccountDepositWithdrawProps) => {
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [amount, setAmount] = useState(0);
  const { toast } = useToast();
  const { addTransaction } = useTransactions(user?.id);

  const handleDeposit = async () => {
    if (amount <= 0) {
      toast({
        title: "Erè",
        description: "Antre yon montan ki pozitif.",
        variant: "destructive"
      });
      return;
    }

    setIsDepositing(true);
    try {
      // 1. First update the bank account balance
      const { error: balanceError } = await supabase
        .from('bank_accounts')
        .update({ 
          balance: account.balance + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', account.id);

      if (balanceError) throw balanceError;

      // 2. Then create a transaction record
      await addTransaction({
        amount,
        transaction_type: 'deposit',
        description: 'Depo',
        account_id: account.id,
        user_id: user!.id
      });

      // 3. Refresh profile to get updated accounts
      await refreshProfile();
      
      // Reset form
      setAmount(0);
      
      toast({
        title: "Depo reyisi",
        description: `${amount} HTG ajoute nan kont ou.`,
      });
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

    if (amount > account.balance) {
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
      const { error: balanceError } = await supabase
        .from('bank_accounts')
        .update({ 
          balance: account.balance - amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', account.id);

      if (balanceError) throw balanceError;

      // 2. Then create a transaction record
      await addTransaction({
        amount: -amount, // Negative for withdrawal
        transaction_type: 'withdrawal',
        description: 'Retrè',
        account_id: account.id,
        user_id: user!.id
      });

      // 3. Refresh profile to get updated accounts
      await refreshProfile();
      
      // Reset form
      setAmount(0);
      
      toast({
        title: "Retrè reyisi",
        description: `${amount} HTG retire nan kont ou.`,
      });
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
    <Card>
      <CardHeader>
        <CardTitle>Fè Tranzaksyon</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-muted-foreground">
              Montan ({account.currency})
            </label>
            <Input
              id="amount"
              type="number"
              min="0"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 block w-full"
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
              disabled={isWithdrawing || amount <= 0 || !user || amount > account.balance}
            >
              {isWithdrawing ? "Ap retire..." : "Retire"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDepositWithdraw;
