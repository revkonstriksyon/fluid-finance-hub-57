
import { ArrowDown, ArrowUp, CreditCard, Eye, EyeOff, Plus, Search, Building, ArrowRight, Calendar, Clock, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BankSection = () => {
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
  
  const { toast } = useToast();
  
  const toggleBalance = () => {
    setHideBalance(!hideBalance);
  };

  const handleTransfer = () => {
    if (!amount || !recipientName || !recipientAccount || !transferPurpose) {
      toast({
        title: "Enfomasyon manke",
        description: "Tanpri ranpli tout chan yo",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Transfè reyisi",
      description: `Ou voye $${amount} bay ${recipientName}`,
    });

    // Reset form
    setAmount("");
    setRecipientName("");
    setRecipientAccount("");
    setTransferPurpose("");
  };

  const handleDeposit = () => {
    if (!depositAmount || !depositMethod) {
      toast({
        title: "Enfomasyon manke",
        description: "Tanpri ranpli tout chan yo",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Depo reyisi",
      description: `Ou depoze $${depositAmount} nan kont ou`,
    });

    // Reset form
    setDepositAmount("");
  };

  const handlePayBill = () => {
    if (!billProvider || !billAccount || !billAmount) {
      toast({
        title: "Enfomasyon manke",
        description: "Tanpri ranpli tout chan yo",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Peman reyisi",
      description: `Ou peye $${billAmount} pou ${billProvider}`,
    });

    // Reset form
    setBillProvider("");
    setBillAccount("");
    setBillAmount("");
  };

  const handleAddAccount = () => {
    if (!newAccountName || !newAccountType) {
      toast({
        title: "Enfomasyon manke",
        description: "Tanpri ranpli tout chan yo",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Kont kreye",
      description: `Ou kreye yon nouvo kont ${newAccountType}: ${newAccountName}`,
    });

    // Reset form
    setNewAccountName("");
    setNewAccountType("savings");
  };
  
  // Sample transaction data
  const transactions = [
    { id: 1, type: 'deposit', amount: 1500, description: 'Salè Mwa Jen', date: '24 Jen, 2023', icon: ArrowDown, iconColor: 'text-finance-success'},
    { id: 2, type: 'withdrawal', amount: 45, description: 'Market Place', date: '22 Jen, 2023', icon: ArrowUp, iconColor: 'text-finance-danger'},
    { id: 3, type: 'withdrawal', amount: 120, description: 'Achte Telefòn', date: '20 Jen, 2023', icon: ArrowUp, iconColor: 'text-finance-danger'},
    { id: 4, type: 'deposit', amount: 300, description: 'Travay Freelance', date: '18 Jen, 2023', icon: ArrowDown, iconColor: 'text-finance-success'},
  ];

  // Account details data
  const accountDetails = {
    accountNumber: "1234567890",
    iban: "HT12 ABCD 1234 5678 9012 3456 78",
    swiftCode: "HABKHT2X",
    openDate: "15 Jen, 2022",
    interestRate: "1.25%",
    availableBalance: 1450,
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
          <h2 className="text-3xl font-bold">
            {hideBalance ? '••••••' : '$1,985.40'}
          </h2>
          <p className="text-white/70 text-sm mt-1">Dènye mizajou: Jodi a, 10:45 AM</p>
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
                <Button onClick={handleDeposit}>Depoze Lajan</Button>
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
                  
                  <Button onClick={handleTransfer} className="w-full">
                    Voye Lajan
                  </Button>
                </TabsContent>
                
                <TabsContent value="bill" className="space-y-4">
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
                  
                  <Button onClick={handlePayBill} className="w-full">
                    Peye Bòdwo
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
                  
                  <Button onClick={handleTransfer} className="w-full">
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
            <div 
              className="flex items-center justify-between p-3 bg-finance-lightGray/50 dark:bg-white/5 rounded-lg cursor-pointer hover:bg-finance-lightGray dark:hover:bg-white/10 transition-colors"
              onClick={() => setShowAccountDetails(!showAccountDetails)}
            >
              <div className="flex items-center">
                <div className="bg-finance-blue/20 p-2 rounded-lg mr-3">
                  <CreditCard className="h-5 w-5 text-finance-blue" />
                </div>
                <div>
                  <p className="font-medium">Kont Kouran</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Aksè fasilman ak lajan</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{hideBalance ? '••••' : '$1,450'}</p>
                <p className="text-xs text-finance-charcoal/70 dark:text-white/70">
                  {showAccountDetails ? "Kache detay" : "Wè detay"}
                </p>
              </div>
            </div>
            
            {showAccountDetails && (
              <div className="p-4 bg-finance-lightGray/30 dark:bg-white/5 rounded-lg">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Nimewo Kont</p>
                    <p className="text-sm font-medium">{accountDetails.accountNumber}</p>
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
                    <p className="text-sm font-medium">${accountDetails.availableBalance}</p>
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
            
            <div className="flex items-center justify-between p-3 bg-finance-lightGray/50 dark:bg-white/5 rounded-lg hover:bg-finance-lightGray dark:hover:bg-white/10 transition-colors">
              <div className="flex items-center">
                <div className="bg-finance-gold/20 p-2 rounded-lg mr-3">
                  <CreditCard className="h-5 w-5 text-finance-gold" />
                </div>
                <div>
                  <p className="font-medium">Kont Epay</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Ekonomi avèk enterè</p>
                </div>
              </div>
              <p className="font-bold">{hideBalance ? '••••' : '$535.40'}</p>
            </div>
            
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
                  <Button onClick={handleAddAccount}>Kreye Kont</Button>
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
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-finance-lightGray/50 dark:hover:bg-white/5 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${transaction.type === 'deposit' ? 'bg-finance-success/10' : 'bg-finance-danger/10'}`}>
                    <transaction.icon className={`h-5 w-5 ${transaction.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-finance-charcoal/70 dark:text-white/70">{transaction.date}</p>
                  </div>
                </div>
                <p className={`font-bold ${transaction.type === 'deposit' ? 'text-finance-success' : 'text-finance-danger'}`}>
                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankSection;
