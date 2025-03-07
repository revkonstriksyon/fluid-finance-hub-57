
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useBankData } from '@/hooks/useBankData';
import { useBankOperations } from '@/hooks/useBankOperations';
import { BalanceCard } from './bank/BalanceCard';
import { AccountList } from './bank/AccountList';
import { TransactionList } from './bank/TransactionList';

const BankSection = () => {
  const { user } = useAuth();
  const { accounts, transactions, loading } = useBankData();
  const { 
    makeDeposit, 
    makeTransfer, 
    payBill, 
    addAccount,
    processingDeposit,
    processingTransfer,
    processingBill,
    processingAddAccount
  } = useBankOperations();
  
  const [hideBalance, setHideBalance] = useState(false);
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [transferPurpose, setTransferPurpose] = useState("");
  const [paymentCategory, setPaymentCategory] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState("card");
  const [billProvider, setBillProvider] = useState("");
  const [billAccount, setBillAccount] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountType, setNewAccountType] = useState("savings");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const [transferMode, setTransferMode] = useState<'account' | 'user'>('account');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');
  
  const toggleBalance = () => {
    setHideBalance(!hideBalance);
  };

  const handleUserSelect = (userId: string, userEmail: string) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(userEmail);
  };

  const handleTransfer = async () => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou fè yon transfè.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedAccountId) {
      toast({
        title: "Kont pa seleksyone",
        description: "Tanpri chwazi yon kont pou fè transfè a.",
        variant: "destructive"
      });
      return;
    }

    if (transferMode === 'account') {
      if (!amount || !recipientName || !recipientAccount || !transferPurpose) {
        toast({
          title: "Enfomasyon manke",
          description: "Tanpri ranpli tout chan yo",
          variant: "destructive"
        });
        return;
      }

      const result = await makeTransfer(
        selectedAccountId,
        null, // We don't have specific user ID
        null, // We don't have specific account ID
        Number(amount),
        `Transfè bay ${recipientName} - ${recipientAccount}`,
        transferPurpose
      );

      if (result.success) {
        // Reset form
        setAmount("");
        setRecipientName("");
        setRecipientAccount("");
        setTransferPurpose("");
      }
    } else {
      // User-to-user transfer
      if (!amount || !selectedUserId || !transferPurpose) {
        toast({
          title: "Enfomasyon manke",
          description: "Tanpri ranpli tout chan yo",
          variant: "destructive"
        });
        return;
      }

      const result = await makeTransfer(
        selectedAccountId,
        selectedUserId,
        null, // The backend will find user's account
        Number(amount),
        `Transfè bay ${selectedUserEmail}`,
        transferPurpose
      );

      if (result.success) {
        // Reset form
        setAmount("");
        setSelectedUserId(null);
        setSelectedUserEmail("");
        setTransferPurpose("");
      }
    }
  };

  const handleDeposit = async () => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou fè yon depo.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedAccountId) {
      toast({
        title: "Kont pa seleksyone",
        description: "Tanpri chwazi yon kont pou fè depo a.",
        variant: "destructive"
      });
      return;
    }

    if (!depositAmount || !depositMethod) {
      toast({
        title: "Enfomasyon manke",
        description: "Tanpri ranpli tout chan yo",
        variant: "destructive"
      });
      return;
    }

    const result = await makeDeposit(
      selectedAccountId,
      Number(depositAmount),
      depositMethod,
      `Depo via ${depositMethod}`
    );

    if (result.success) {
      // Reset form
      setDepositAmount("");
    }
  };

  const handlePayBill = async () => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou peye yon bòdwo.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedAccountId) {
      toast({
        title: "Kont pa seleksyone",
        description: "Tanpri chwazi yon kont pou fè peman an.",
        variant: "destructive"
      });
      return;
    }

    if (!billProvider || !billAccount || !billAmount) {
      toast({
        title: "Enfomasyon manke",
        description: "Tanpri ranpli tout chan yo",
        variant: "destructive"
      });
      return;
    }

    const result = await payBill(
      selectedAccountId,
      billProvider,
      billAccount,
      Number(billAmount)
    );

    if (result.success) {
      // Reset form
      setBillProvider("");
      setBillAccount("");
      setBillAmount("");
    }
  };

  const handleAddAccount = async () => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou kreye yon kont.",
        variant: "destructive"
      });
      return;
    }

    if (!newAccountName || !newAccountType) {
      toast({
        title: "Enfomasyon manke",
        description: "Tanpri ranpli tout chan yo",
        variant: "destructive"
      });
      return;
    }

    const result = await addAccount(newAccountName, newAccountType);

    if (result.success) {
      // Reset form
      setNewAccountName("");
      setNewAccountType("savings");
    }
  };
  
  // Get primary account for display in total balance
  const primaryAccount = accounts.find(account => account.is_primary) || accounts[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <BalanceCard
        loading={loading}
        hideBalance={hideBalance}
        toggleBalance={toggleBalance}
        primaryAccount={primaryAccount}
        // Deposit props
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        setSelectedAccountId={setSelectedAccountId}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        depositMethod={depositMethod}
        setDepositMethod={setDepositMethod}
        handleDeposit={handleDeposit}
        processingDeposit={processingDeposit}
        // Transfer props
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
      
      <div className="grid md:grid-cols-2 gap-6">
        <AccountList
          accounts={accounts}
          loading={loading}
          hideBalance={hideBalance}
          newAccountName={newAccountName}
          setNewAccountName={setNewAccountName}
          newAccountType={newAccountType}
          setNewAccountType={setNewAccountType}
          handleAddAccount={handleAddAccount}
          processingAddAccount={processingAddAccount}
        />
        
        <TransactionList
          transactions={transactions}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default BankSection;
