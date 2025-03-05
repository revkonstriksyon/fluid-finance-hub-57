
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { BankAccount } from '@/types/auth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TransferForm from './TransferForm';
import BankConnection from './BankConnection';
import RecurringPaymentForm from './RecurringPaymentForm';
import ScheduledPaymentsList from './ScheduledPaymentsList';

interface TransferPaymentsProps {
  bankAccounts: BankAccount[];
  user: User | null;
  refreshProfile: () => Promise<void>;
}

const TransferPayments = ({ bankAccounts, user, refreshProfile }: TransferPaymentsProps) => {
  const [activeTab, setActiveTab] = useState('transfer');
  const [selectedAccount, setSelectedAccount] = useState(bankAccounts[0]?.id || '');
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="transfer">Transfè Rapid</TabsTrigger>
          <TabsTrigger value="recurring">Peman Rekiran</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transfer" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransferForm 
              bankAccounts={bankAccounts}
              user={user}
              refreshProfile={refreshProfile}
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
            />
            <BankConnection />
          </div>
        </TabsContent>
        
        <TabsContent value="recurring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecurringPaymentForm 
              bankAccounts={bankAccounts}
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
            />
            <ScheduledPaymentsList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransferPayments;
