
import { useState } from 'react';
import { CreditCard, Info, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BankAccount } from '@/hooks/useBankData';
import { AddAccountDialog } from './dialogs/AddAccountDialog';

interface AccountListProps {
  accounts: BankAccount[];
  loading: boolean;
  hideBalance: boolean;
  newAccountName: string;
  setNewAccountName: (name: string) => void;
  newAccountType: string;
  setNewAccountType: (type: string) => void;
  handleAddAccount: () => Promise<void>;
  processingAddAccount: boolean;
}

interface AccountDetailsProps {
  account: BankAccount;
  accountDetails: {
    iban: string;
    swiftCode: string;
    openDate: string;
    interestRate: string;
    availableBalance: number;
    pendingTransactions: number;
    minimumBalance: number;
    maxWithdrawal: number;
  };
}

const AccountDetails = ({ account, accountDetails }: AccountDetailsProps) => {
  return (
    <div className="p-4 bg-finance-lightGray/30 dark:bg-white/5 rounded-lg">
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Nimewo Kont</p>
          <p className="text-sm font-medium">{account.account_number}</p>
        </div>
        <div>
          <p className="text-xs text-finance-charcoal/70 dark:text-white/70">IBAN</p>
          <p className="text-sm font-medium truncate">{accountDetails.iban}</p>
        </div>
        <div>
          <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Kòd SWIFT</p>
          <p className="text-sm font-medium">{accountDetails.swiftCode}</p>
        </div>
        <div>
          <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Dat Ouvèti</p>
          <p className="text-sm font-medium">{accountDetails.openDate}</p>
        </div>
        <div>
          <p className="text-xs text-finance-charcoal/70 dark:text-white/70">To Enterè</p>
          <p className="text-sm font-medium">{accountDetails.interestRate}</p>
        </div>
        <div>
          <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Balans Disponib</p>
          <p className="text-sm font-medium">${account.balance}</p>
        </div>
        <div>
          <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Tranzaksyon an Atant</p>
          <p className="text-sm font-medium">${accountDetails.pendingTransactions}</p>
        </div>
        <div>
          <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Balans Minimòm</p>
          <p className="text-sm font-medium">${accountDetails.minimumBalance}</p>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="outline" className="flex-1">
          <Clock className="h-4 w-4 mr-2" />
          Istwa
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          <Info className="h-4 w-4 mr-2" />
          Detay
        </Button>
      </div>
    </div>
  );
};

export const AccountList = ({
  accounts,
  loading,
  hideBalance,
  newAccountName,
  setNewAccountName,
  newAccountType,
  setNewAccountType,
  handleAddAccount,
  processingAddAccount
}: AccountListProps) => {
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Format account type display
  const formatAccountType = (type: string) => {
    switch(type.toLowerCase()) {
      case 'checking': return 'Kont Kouran';
      case 'savings': return 'Kont Epay';
      case 'investment': return 'Kont Envestisman';
      case 'business': return 'Kont Biznis';
      default: return type;
    }
  };

  // Account details data
  const accountDetails = {
    iban: "HT12 ABCD 1234 5678 9012 3456 78",
    swiftCode: "HABKHT2X",
    openDate: "15 Jen, 2022",
    interestRate: "1.25%",
    availableBalance: accounts.find(a => a.id === selectedAccountId)?.balance || 0,
    pendingTransactions: 0,
    minimumBalance: 100,
    maxWithdrawal: 1000,
  };

  return (
    <div className="finance-card">
      <h3 className="section-title mb-6">Kont yo</h3>
      
      <div className="space-y-4">
        {loading ? (
          Array(2).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full bg-finance-lightGray/30" />
          ))
        ) : accounts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-finance-charcoal/70 dark:text-white/70">Ou pa gen okenn kont pou kounye a.</p>
          </div>
        ) : (
          accounts.map(account => (
            <div
              key={account.id}
              className="flex items-center justify-between p-3 bg-finance-lightGray/50 dark:bg-white/5 rounded-lg cursor-pointer hover:bg-finance-lightGray dark:hover:bg-white/10 transition-colors"
              onClick={() => {
                setShowAccountDetails(!showAccountDetails);
                setSelectedAccountId(account.id);
              }}
            >
              <div className="flex items-center">
                <div className={`${account.account_type === 'savings' ? 'bg-finance-gold/20' : 'bg-finance-blue/20'} p-2 rounded-lg mr-3`}>
                  <CreditCard className={`h-5 w-5 ${account.account_type === 'savings' ? 'text-finance-gold' : 'text-finance-blue'}`} />
                </div>
                <div>
                  <p className="font-medium">{formatAccountType(account.account_type)}</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">{account.account_name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{hideBalance ? '••••' : `$${account.balance}`}</p>
                <p className="text-xs text-finance-charcoal/70 dark:text-white/70">
                  {showAccountDetails && selectedAccountId === account.id ? "Kache detay" : "Wè detay"}
                </p>
              </div>
            </div>
          ))
        )}
        
        {showAccountDetails && selectedAccountId && (
          <AccountDetails 
            account={accounts.find(a => a.id === selectedAccountId)!}
            accountDetails={accountDetails}
          />
        )}
        
        <AddAccountDialog
          newAccountName={newAccountName}
          setNewAccountName={setNewAccountName}
          newAccountType={newAccountType}
          setNewAccountType={setNewAccountType}
          handleAddAccount={handleAddAccount}
          processingAddAccount={processingAddAccount}
        />
      </div>
    </div>
  );
};
