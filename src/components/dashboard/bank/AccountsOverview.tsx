
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { BankAccount } from '@/types/auth';
import { Transaction } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, Plus } from 'lucide-react';
import AccountDepositWithdraw from './AccountDepositWithdraw';
import AccountCreate from './AccountCreate';
import AccountsList from './components/AccountsList';
import RecentTransactions from './components/RecentTransactions';

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    await refreshProfile();
    toast({
      title: "Aktyalize",
      description: "Enfòmasyon kont yo aktyalize.",
    });
  };

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
        <AccountsList 
          bankAccounts={bankAccounts}
          selectedAccount={selectedAccount}
          onSelectAccount={setSelectedAccount}
          onCreateAccount={() => setIsCreateModalOpen(true)}
        />
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
      <RecentTransactions
        transactions={transactions}
        transactionsLoading={transactionsLoading}
      />

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

export default AccountsOverview;
