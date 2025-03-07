
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BankAccount } from '@/hooks/useBankData';
import { DepositDialog } from './dialogs/DepositDialog';
import { TransferDialog } from './dialogs/TransferDialog';

interface BalanceCardProps {
  loading: boolean;
  hideBalance: boolean;
  toggleBalance: () => void;
  primaryAccount: BankAccount | undefined;
  // Deposit props
  accounts: BankAccount[];
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string) => void;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  depositMethod: string;
  setDepositMethod: (method: string) => void;
  handleDeposit: () => Promise<void>;
  processingDeposit: boolean;
  // Transfer props
  amount: string;
  setAmount: (amount: string) => void;
  recipientName: string;
  setRecipientName: (name: string) => void;
  recipientAccount: string;
  setRecipientAccount: (account: string) => void;
  transferPurpose: string;
  setTransferPurpose: (purpose: string) => void;
  paymentCategory: string;
  setPaymentCategory: (category: string) => void;
  transferMode: 'account' | 'user';
  setTransferMode: (mode: 'account' | 'user') => void;
  selectedUserId: string | null;
  selectedUserEmail: string;
  handleUserSelect: (userId: string, userEmail: string) => void;
  handleTransfer: () => Promise<void>;
  processingTransfer: boolean;
  billProvider: string;
  setBillProvider: (provider: string) => void;
  billAccount: string;
  setBillAccount: (account: string) => void;
  billAmount: string;
  setBillAmount: (amount: string) => void;
  handlePayBill: () => Promise<void>;
  processingBill: boolean;
}

export const BalanceCard = ({
  loading,
  hideBalance,
  toggleBalance,
  primaryAccount,
  accounts,
  selectedAccountId,
  setSelectedAccountId,
  depositAmount,
  setDepositAmount,
  depositMethod,
  setDepositMethod,
  handleDeposit,
  processingDeposit,
  amount,
  setAmount,
  recipientName,
  setRecipientName,
  recipientAccount,
  setRecipientAccount,
  transferPurpose,
  setTransferPurpose,
  paymentCategory,
  setPaymentCategory,
  transferMode,
  setTransferMode,
  selectedUserId,
  selectedUserEmail,
  handleUserSelect,
  handleTransfer,
  processingTransfer,
  billProvider,
  setBillProvider,
  billAccount,
  setBillAccount,
  billAmount,
  setBillAmount,
  handlePayBill,
  processingBill
}: BalanceCardProps) => {
  return (
    <div className="balance-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white/90">Total Balans</h3>
        <Button variant="ghost" size="icon" onClick={toggleBalance} className="text-white/80 hover:text-white">
          {hideBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="mb-4">
        {loading ? (
          <Skeleton className="h-9 w-36 bg-white/10" />
        ) : (
          <>
            <h2 className="text-3xl font-bold">
              {hideBalance ? '••••••' : primaryAccount ? `$${primaryAccount.balance}` : '$0.00'}
            </h2>
            <p className="text-white/70 text-sm mt-1">Dènye mizajou: Jodi a, {new Date().toLocaleTimeString()}</p>
          </>
        )}
      </div>
      
      <div className="flex space-x-2">
        <DepositDialog
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          setSelectedAccountId={setSelectedAccountId}
          depositAmount={depositAmount}
          setDepositAmount={setDepositAmount}
          depositMethod={depositMethod}
          setDepositMethod={setDepositMethod}
          handleDeposit={handleDeposit}
          processingDeposit={processingDeposit}
        />
        
        <TransferDialog
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          setSelectedAccountId={setSelectedAccountId}
          amount={amount}
          setAmount={setAmount}
          recipientName={recipientName}
          setRecipientName={setRecipientName}
          recipientAccount={recipientAccount}
          setRecipientAccount={setRecipientAccount}
          transferPurpose={transferPurpose}
          setTransferPurpose={setTransferPurpose}
          paymentCategory={paymentCategory}
          setPaymentCategory={setPaymentCategory}
          transferMode={transferMode}
          setTransferMode={setTransferMode}
          selectedUserId={selectedUserId}
          selectedUserEmail={selectedUserEmail}
          handleUserSelect={handleUserSelect}
          handleTransfer={handleTransfer}
          processingTransfer={processingTransfer}
          billProvider={billProvider}
          setBillProvider={setBillProvider}
          billAccount={billAccount}
          setBillAccount={setBillAccount}
          billAmount={billAmount}
          setBillAmount={setBillAmount}
          handlePayBill={handlePayBill}
          processingBill={processingBill}
        />
      </div>
    </div>
  );
};
