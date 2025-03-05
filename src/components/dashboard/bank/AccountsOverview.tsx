import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { BankAccount } from '@/types/auth';
import { Transaction } from '@/hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Download, RefreshCw, Plus, WalletCards } from 'lucide-react';
import AccountDepositWithdraw from './AccountDepositWithdraw';
import AccountCreate from './AccountCreate';

interface AccountsOverviewProps {
  bankAccounts: BankAccount[];
  transactions: Transaction[];
  transactionsLoading: boolean;
  user: User | null;
  refreshProfile: () => Promise<void>;
}

const AccountsOverview = ({ 
  bankAccounts, 
  transactions, 
  transactionsLoading, 
  user, 
  refreshProfile 
}: AccountsOverviewProps) => {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    bankAccounts.length > 0 ? bankAccounts[0] : null
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const handleExportTransactions = () => {
    if (transactions.length === 0) {
      toast({
        title: "Pa gen tranzaksyon",
        description: "Pa gen okenn tranzaksyon pou ekspòte.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      // Convert transactions to CSV
      const headers = ["Dat", "Tip", "Montan", "Deskripsyon"];
      const csvRows = [headers];

      transactions.forEach(tx => {
        const row = [
          new Date(tx.created_at).toLocaleDateString('fr-FR'),
          tx.transaction_type,
          tx.amount.toString(),
          tx.description || ''
        ];
        csvRows.push(row);
      });

      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      
      // Create a blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `tranzaksyon_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Ekspòtasyon reyisi",
        description: "Tranzaksyon yo ekspòte avèk siksè.",
      });
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast({
        title: "Erè ekspòtasyon",
        description: "Pa kapab ekspòte tranzaksyon yo. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = async () => {
    await refreshProfile();
    toast({
      title: "Aktyalize",
      description: "Enfòmasyon kont yo aktyalize.",
    });
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Account List */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kont Labank Ou</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktyalize
          </Button>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajoute Kont
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bankAccounts.length > 0 ? (
          bankAccounts.map(account => (
            <Card 
              key={account.id} 
              className={`cursor-pointer transition-all ${selectedAccount?.id === account.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedAccount(account)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{account.account_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {account.account_type && `${getAccountTypeName(account.account_type)} • `}
                      Nimewo: {account.account_number}
                    </p>
                  </div>
                  <WalletCards className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Balans Aktyèl</p>
                  <p className="text-3xl font-bold mt-1">
                    {account.currency} {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-3">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Ou pa gen okenn kont labank. Ajoute youn pou kòmanse.</p>
              <Button className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajoute Kont
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Deposit/Withdraw Section */}
      {selectedAccount && (
        <AccountDepositWithdraw 
          account={selectedAccount} 
          user={user} 
          refreshProfile={refreshProfile} 
        />
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Resan Tranzaksyon</CardTitle>
            <CardDescription>Dènye tranzaksyon ou yo</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportTransactions} disabled={isExporting || transactions.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Ap ekspòte..." : "Ekspòte"}
          </Button>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <p className="text-center py-4">Ap chaje tranzaksyon yo...</p>
          ) : recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map(transaction => (
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
              <Button variant="link" className="w-full mt-2" onClick={() => document.querySelector('[value="transactions"]')?.dispatchEvent(new Event('click'))}>
                Wè tout tranzaksyon
              </Button>
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Pa gen okenn tranzaksyon nan istwa ou.</p>
          )}
        </CardContent>
      </Card>

      {/* Create Account Modal */}
      <AccountCreate
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        user={user}
        refreshProfile={refreshProfile}
      />
    </div>
  );
};

// Helper to get account type display name
const getAccountTypeName = (accountType: string) => {
  const types: Record<string, string> = {
    'current': 'Kouran',
    'savings': 'Epay',
    'business': 'Biznis',
    'credit': 'Kredi'
  };
  return types[accountType] || accountType;
};

export default AccountsOverview;
