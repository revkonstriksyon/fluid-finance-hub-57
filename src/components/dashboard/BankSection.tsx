
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AccountsOverview from './bank/AccountsOverview';
import TransactionHistory from './bank/TransactionHistory';
import TransferPayments from './bank/transfers/TransferPayments';
import SecuritySettings from './bank/SecuritySettings';

const BankSection = () => {
  const { user, bankAccounts, refreshProfile } = useAuth();
  const { transactions, loading: transactionsLoading } = useTransactions(user?.id);
  const [activeTab, setActiveTab] = useState('accounts');

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs defaultValue="accounts" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="accounts">Kont & Balans</TabsTrigger>
          <TabsTrigger value="transactions">Jesyon Tranzaksyon</TabsTrigger>
          <TabsTrigger value="transfers">Transfè & Peman</TabsTrigger>
          <TabsTrigger value="security">Sekirite</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="space-y-6">
          <AccountsOverview 
            bankAccounts={bankAccounts}
            transactions={transactions}
            transactionsLoading={transactionsLoading}
            user={user}
            refreshProfile={refreshProfile}
          />
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6">
          <TransactionHistory 
            transactions={transactions}
            transactionsLoading={transactionsLoading}
          />
        </TabsContent>
        
        <TabsContent value="transfers" className="space-y-6">
          <TransferPayments 
            bankAccounts={bankAccounts}
            user={user}
            refreshProfile={refreshProfile}
          />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <SecuritySettings 
            user={user}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BankSection;
