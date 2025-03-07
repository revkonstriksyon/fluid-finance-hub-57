
import { ArrowDown, ArrowUp, CreditCard, Eye, EyeOff, Plus, Search, Building, ArrowRight, Calendar, Clock, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { useBankData } from '@/hooks/useBankData';
import { useBankOperations } from '@/hooks/useBankOperations';
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';

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
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const toggleBalance = () => {
    setHideBalance(!hideBalance);
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
      null, // We don't have specific user ID in this simple implementation
      null, // We don't have specific account ID in this simple implementation
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

  // Get icon for transaction type
  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'deposit':
      case 'transfer_received':
        return ArrowDown;
      case 'withdrawal':
      case 'transfer_sent':
      case 'payment':
        return ArrowUp;
      default:
        return ArrowRight;
    }
  };

  // Format transaction amount with +/- sign
  const formatTransactionAmount = (transaction: any) => {
    const isPositive = transaction.transaction_type === 'deposit' || transaction.transaction_type === 'transfer_received';
    return `${isPositive ? '+' : '-'}$${Math.abs(transaction.amount)}`;
  };

  // Get transaction color class
  const getTransactionColorClass = (transaction: any) => {
    const isPositive = transaction.transaction_type === 'deposit' || transaction.transaction_type === 'transfer_received';
    return isPositive ? 'text-finance-success' : 'text-finance-danger';
  };

  // Get background color class for transaction icon
  const getTransactionBgClass = (transaction: any) => {
    const isPositive = transaction.transaction_type === 'deposit' || transaction.transaction_type === 'transfer_received';
    return isPositive ? 'bg-finance-success/10' : 'bg-finance-danger/10';
  };

  // Format relative time for transaction
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  // Account details data
  const accountDetails = {
    iban: "HT12 ABCD 1234 5678 9012 3456 78",
    swiftCode: "HABKHT2X",
    openDate: "15 Jen, 2022",
    interestRate: "1.25%",
    availableBalance: primaryAccount?.balance || 0,
    pendingTransactions: 0,
    minimumBalance: 100,
    maxWithdrawal: 1000,
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
                <ArrowDown className="h-4 w-4 mr-2" />
                Depoze
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Depoze Lajan</DialogTitle>
                <DialogDescription>
                  Chwazi metòd depo ou epi antre montan an.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {accounts.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="deposit-account">Kont</Label>
                    <Select 
                      value={selectedAccountId || ''} 
                      onValueChange={setSelectedAccountId}
                    >
                      <SelectTrigger id="deposit-account">
                        <SelectValue placeholder="Chwazi kont" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_name} - {formatAccountType(account.account_type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="deposit-amount">Montan</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70">$</span>
                    <Input 
                      id="deposit-amount" 
                      value={depositAmount} 
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="pl-8" 
                      placeholder="0.00"
                      type="number"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deposit-method">Metòd Depo</Label>
                  <Select value={depositMethod} onValueChange={setDepositMethod}>
                    <SelectTrigger id="deposit-method">
                      <SelectValue placeholder="Chwazi metòd depo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Kat Kredi/Debi</SelectItem>
                      <SelectItem value="bank">Transfè Bank</SelectItem>
                      <SelectItem value="cash">Kach nan Branch</SelectItem>
                      <SelectItem value="check">Depo Chèk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {depositMethod === 'card' && (
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Nimewo Kat</Label>
                    <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Dat Ekspirasyon</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleDeposit} 
                  disabled={processingDeposit || !depositAmount || !depositMethod || !selectedAccountId}
                >
                  {processingDeposit ? 'Ap trete...' : 'Depoze Lajan'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
                <ArrowUp className="h-4 w-4 mr-2" />
                Voye
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Voye Lajan</DialogTitle>
                <DialogDescription>
                  Antre enfòmasyon benefisyè a epi montan an.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="transfer" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="transfer">Transfè</TabsTrigger>
                  <TabsTrigger value="bill">Peye Bòdwo</TabsTrigger>
                  <TabsTrigger value="market">Makèt</TabsTrigger>
                </TabsList>
                
                <TabsContent value="transfer" className="space-y-4">
                  {accounts.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="transfer-account">Kont</Label>
                      <Select 
                        value={selectedAccountId || ''} 
                        onValueChange={setSelectedAccountId}
                      >
                        <SelectTrigger id="transfer-account">
                          <SelectValue placeholder="Chwazi kont" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map(account => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.account_name} - {formatAccountType(account.account_type)} (${account.balance})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Non Benefisyè</Label>
                    <Input 
                      id="recipient" 
                      value={recipientName} 
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Non konplè"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="account">Nimewo Kont</Label>
                    <Input 
                      id="account" 
                      value={recipientAccount} 
                      onChange={(e) => setRecipientAccount(e.target.value)}
                      placeholder="Nimewo kont oswa IBAN"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Montan</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70">$</span>
                      <Input 
                        id="amount" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-8" 
                        placeholder="0.00"
                        type="number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Rezon Transfè</Label>
                    <Select value={transferPurpose} onValueChange={setTransferPurpose}>
                      <SelectTrigger id="purpose">
                        <SelectValue placeholder="Chwazi rezon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">Sipò Fanmi</SelectItem>
                        <SelectItem value="friend">Zanmi</SelectItem>
                        <SelectItem value="business">Biznis</SelectItem>
                        <SelectItem value="other">Lòt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleTransfer} 
                    className="w-full"
                    disabled={processingTransfer || !amount || !recipientName || !recipientAccount || !transferPurpose || !selectedAccountId}
                  >
                    {processingTransfer ? 'Ap trete...' : 'Voye Lajan'}
                  </Button>
                </TabsContent>
                
                <TabsContent value="bill" className="space-y-4">
                  {accounts.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="bill-pay-account">Kont</Label>
                      <Select 
                        value={selectedAccountId || ''} 
                        onValueChange={setSelectedAccountId}
                      >
                        <SelectTrigger id="bill-pay-account">
                          <SelectValue placeholder="Chwazi kont" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map(account => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.account_name} - {formatAccountType(account.account_type)} (${account.balance})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                
                  <div className="space-y-2">
                    <Label htmlFor="provider">Konpayi</Label>
                    <Select value={billProvider} onValueChange={setBillProvider}>
                      <SelectTrigger id="provider">
                        <SelectValue placeholder="Chwazi konpayi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electricity">Elektrisite</SelectItem>
                        <SelectItem value="water">Dlo</SelectItem>
                        <SelectItem value="phone">Telefòn</SelectItem>
                        <SelectItem value="internet">Entènèt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bill-account">Nimewo Kont</Label>
                    <Input 
                      id="bill-account" 
                      value={billAccount} 
                      onChange={(e) => setBillAccount(e.target.value)}
                      placeholder="Nimewo kont kliyan"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bill-amount">Montan</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70">$</span>
                      <Input 
                        id="bill-amount" 
                        value={billAmount} 
                        onChange={(e) => setBillAmount(e.target.value)}
                        className="pl-8" 
                        placeholder="0.00"
                        type="number"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePayBill} 
                    className="w-full"
                    disabled={processingBill || !billProvider || !billAccount || !billAmount || !selectedAccountId}
                  >
                    {processingBill ? 'Ap trete...' : 'Peye Bòdwo'}
                  </Button>
                </TabsContent>
                
                <TabsContent value="market" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="marketplace">Makèt</Label>
                    <Select value={paymentCategory} onValueChange={setPaymentCategory}>
                      <SelectTrigger id="marketplace">
                        <SelectValue placeholder="Chwazi makèt" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amazon">Amazon</SelectItem>
                        <SelectItem value="ebay">eBay</SelectItem>
                        <SelectItem value="walmart">Walmart</SelectItem>
                        <SelectItem value="other">Lòt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="market-amount">Montan</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70">$</span>
                      <Input 
                        id="market-amount" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-8" 
                        placeholder="0.00"
                        type="number"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleTransfer} 
                    className="w-full"
                    disabled={!amount || !paymentCategory}
                  >
                    Peye
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
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
              <div className="p-4 bg-finance-lightGray/30 dark:bg-white/5 rounded-lg">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Nimewo Kont</p>
                    <p className="text-sm font-medium">
                      {accounts.find(a => a.id === selectedAccountId)?.account_number || ''}
                    </p>
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
                    <p className="text-sm font-medium">
                      ${accounts.find(a => a.id === selectedAccountId)?.balance || 0}
                    </p>
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
            )}
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-dashed">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajoute Nouvo Kont
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Kreye Nouvo Kont</DialogTitle>
                  <DialogDescription>
                    Ranpli enfòmasyon yo pou kreye yon nouvo kont.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Non Kont</Label>
                    <Input 
                      id="account-name" 
                      value={newAccountName} 
                      onChange={(e) => setNewAccountName(e.target.value)}
                      placeholder="Ekri non kont lan"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="account-type">Tip Kont</Label>
                    <Select value={newAccountType} onValueChange={setNewAccountType}>
                      <SelectTrigger id="account-type">
                        <SelectValue placeholder="Chwazi tip kont" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savings">Kont Epay</SelectItem>
                        <SelectItem value="checking">Kont Kouran</SelectItem>
                        <SelectItem value="investment">Kont Envestisman</SelectItem>
                        <SelectItem value="business">Kont Biznis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleAddAccount}
                    disabled={processingAddAccount || !newAccountName || !newAccountType}
                  >
                    {processingAddAccount ? 'Ap trete...' : 'Kreye Kont'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="finance-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title mb-0">Dènye Tranzaksyon</h3>
            <Button variant="link" className="text-finance-blue">Wè Tout</Button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              Array(4).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full bg-finance-lightGray/30" />
              ))
            ) : transactions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-finance-charcoal/70 dark:text-white/70">Ou pa gen okenn tranzaksyon pou kounye a.</p>
              </div>
            ) : (
              transactions.map((transaction) => {
                const TransactionIcon = getTransactionIcon(transaction.transaction_type);
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-finance-lightGray/50 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${getTransactionBgClass(transaction)}`}>
                        <TransactionIcon className={`h-5 w-5 ${getTransactionColorClass(transaction)}`} />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          {formatRelativeTime(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold ${getTransactionColorClass(transaction)}`}>
                      {formatTransactionAmount(transaction)}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankSection;
