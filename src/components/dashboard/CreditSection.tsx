
import { CreditCard, ShoppingBag, DollarSign, Clock, Percent, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const CreditSection = () => {
  const [activeTab, setActiveTab] = useState("options");
  const [selectedCreditOption, setSelectedCreditOption] = useState<number | null>(null);
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState("6");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseStore, setPurchaseStore] = useState("");
  const [purchaseItems, setPurchaseItems] = useState("");
  const [installments, setInstallments] = useState("3");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const { toast } = useToast();
  
  // Sample credit data
  const availableCredit = 2500;
  const totalCredit = 5000;
  const utilizationRate = (availableCredit / totalCredit) * 100;
  
  const creditOptions = [
    { 
      id: 1, 
      title: "Prè Rapid", 
      description: "Jwenn lajan rapid ak enterè ki jis", 
      icon: Clock, 
      iconBg: "bg-finance-blue/20", 
      iconColor: "text-finance-blue",
      amount: "Jiska $2,000",
      term: "3-12 mwa",
      interestRate: "12.5%",
      processingFee: "$25",
      eligibility: "Bon pou ijans ak depans ki pat planifye",
      requirements: ["Pyès idantite", "Prèv revni (dènye 3 mwa)", "Istwa kredi"]
    },
    { 
      id: 2, 
      title: "Acha an Tranch", 
      description: "Divize peman w pou pi bon kontwòl", 
      icon: ShoppingBag, 
      iconBg: "bg-finance-gold/20", 
      iconColor: "text-finance-gold",
      amount: "Jiska $3,500",
      term: "3-24 mwa",
      interestRate: "10.5%",
      processingFee: "$15",
      eligibility: "Bon pou acha ekipman, mobye, ak lòt byen",
      requirements: ["Pyès idantite", "Prèv revni", "Detay sa w ap achte a"]
    },
    { 
      id: 3, 
      title: "Prè Garanti", 
      description: "Itilize byen ou kòm garanti pou pi bon to", 
      icon: DollarSign, 
      iconBg: "bg-finance-success/20", 
      iconColor: "text-finance-success",
      amount: "Jiska $10,000",
      term: "12-60 mwa",
      interestRate: "8.5%",
      processingFee: "$50",
      eligibility: "Bon pou gwo envestisman ak pwojè",
      requirements: ["Pyès idantite", "Prèv revni", "Dokiman byen garanti a", "Istwa kredi"]
    },
  ];

  const handleApplyForLoan = () => {
    if (!loanAmount || !loanTerm || !loanPurpose) {
      toast({
        title: "Enfomasyon manke",
        description: "Tanpri ranpli tout chan yo",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Demand prè soumèt",
      description: `Ou mande yon prè $${loanAmount} pou ${loanTerm} mwa. N ap revize demand ou a epi n ap kontakte w byento.`,
    });

    // Reset and go back to options
    setLoanAmount("");
    setLoanTerm("6");
    setLoanPurpose("");
    setActiveTab("options");
    setSelectedCreditOption(null);
  };

  const handleMakePurchase = () => {
    if (!purchaseAmount || !purchaseStore || !purchaseItems || !installments || !deliveryAddress) {
      toast({
        title: "Enfomasyon manke",
        description: "Tanpri ranpli tout chan yo",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Acha apwouve",
      description: `Ou te fè yon acha $${purchaseAmount} nan ${purchaseStore} an ${installments} vèsman. Li pral livre nan adrès ou bay la.`,
    });

    // Reset and go back to options
    setPurchaseAmount("");
    setPurchaseStore("");
    setPurchaseItems("");
    setInstallments("3");
    setDeliveryAddress("");
    setActiveTab("options");
    setSelectedCreditOption(null);
  };

  const viewCreditDetails = (id: number) => {
    setSelectedCreditOption(id);
    setActiveTab("details");
  };

  const startLoanApplication = (id: number) => {
    setSelectedCreditOption(id);
    setActiveTab("apply");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="balance-card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-white/90">Kredi Disponib</h3>
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium text-white">
            <Percent className="h-3 w-3 inline mr-1" />
            12.5% APR
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-3xl font-bold">${availableCredit}</h2>
          <p className="text-white/70 text-sm mt-1">Sou limit $5,000</p>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/80">Itilizasyon</span>
            <span className="text-white/80">{100 - Math.round(utilizationRate)}%</span>
          </div>
          <Progress value={utilizationRate} className="h-2 bg-white/20" />
        </div>
        
        <div className="flex space-x-2 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
                <CreditCard className="h-4 w-4 mr-2" />
                Fè Yon Acha
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Fè Yon Acha ak Kredi</DialogTitle>
                <DialogDescription>
                  Antre detay acha ou epi divize li an vèsman.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="purchase-amount">Montan Acha</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70">$</span>
                    <Input 
                      id="purchase-amount" 
                      value={purchaseAmount} 
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      className="pl-8" 
                      placeholder="0.00"
                      type="number"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purchase-store">Magazen</Label>
                  <Input 
                    id="purchase-store" 
                    value={purchaseStore} 
                    onChange={(e) => setPurchaseStore(e.target.value)}
                    placeholder="Non magazen an"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purchase-items">Detay Acha</Label>
                  <Input 
                    id="purchase-items" 
                    value={purchaseItems} 
                    onChange={(e) => setPurchaseItems(e.target.value)}
                    placeholder="Sa w ap achte a"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="installments">Kantite Vèsman</Label>
                  <Select value={installments} onValueChange={setInstallments}>
                    <SelectTrigger id="installments">
                      <SelectValue placeholder="Chwazi kantite vèsman" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Vèsman</SelectItem>
                      <SelectItem value="6">6 Vèsman</SelectItem>
                      <SelectItem value="12">12 Vèsman</SelectItem>
                      <SelectItem value="24">24 Vèsman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delivery-address">Adrès Livrezon</Label>
                  <Input 
                    id="delivery-address" 
                    value={deliveryAddress} 
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Adrès konplè"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleMakePurchase}>Konfime Acha</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
                <DollarSign className="h-4 w-4 mr-2" />
                Mande Prè
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Mande yon Prè</DialogTitle>
                <DialogDescription>
                  Antre enfòmasyon pou demand prè ou a.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="loan-amount">Montan Prè</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70">$</span>
                    <Input 
                      id="loan-amount" 
                      value={loanAmount} 
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="pl-8" 
                      placeholder="0.00"
                      type="number"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loan-term">Dire Prè</Label>
                  <Select value={loanTerm} onValueChange={setLoanTerm}>
                    <SelectTrigger id="loan-term">
                      <SelectValue placeholder="Chwazi dire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Mwa</SelectItem>
                      <SelectItem value="6">6 Mwa</SelectItem>
                      <SelectItem value="12">12 Mwa</SelectItem>
                      <SelectItem value="24">24 Mwa</SelectItem>
                      <SelectItem value="36">36 Mwa</SelectItem>
                      <SelectItem value="48">48 Mwa</SelectItem>
                      <SelectItem value="60">60 Mwa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loan-purpose">Rezon Prè</Label>
                  <Select value={loanPurpose} onValueChange={setLoanPurpose}>
                    <SelectTrigger id="loan-purpose">
                      <SelectValue placeholder="Chwazi rezon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Ijans</SelectItem>
                      <SelectItem value="education">Edikasyon</SelectItem>
                      <SelectItem value="home">Kay / Reparasyon</SelectItem>
                      <SelectItem value="business">Biznis</SelectItem>
                      <SelectItem value="travel">Vwayaj</SelectItem>
                      <SelectItem value="medical">Medikal</SelectItem>
                      <SelectItem value="other">Lòt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleApplyForLoan}>Soumèt Demand</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {activeTab === "options" && (
        <div className="finance-card">
          <h3 className="section-title mb-6">Opsyon Kredi Disponib</h3>
          
          <div className="grid md:grid-cols-3 gap-5">
            {creditOptions.map(option => (
              <div key={option.id} className="border border-finance-midGray/30 dark:border-white/10 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-lg mr-3 ${option.iconBg}`}>
                    <option.icon className={`h-5 w-5 ${option.iconColor}`} />
                  </div>
                  <h4 className="font-medium">{option.title}</h4>
                </div>
                
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-4">
                  {option.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-finance-charcoal/70 dark:text-white/70">Montan:</span>
                    <span className="text-sm font-medium">{option.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-finance-charcoal/70 dark:text-white/70">Tan:</span>
                    <span className="text-sm font-medium">{option.term}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => viewCreditDetails(option.id)}>
                    Plis Detay
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => startLoanApplication(option.id)}>
                    Aplike
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === "details" && selectedCreditOption && (
        <div className="finance-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="section-title mb-0">
              {creditOptions.find(o => o.id === selectedCreditOption)?.title} - Detay
            </h3>
            <Button variant="ghost" onClick={() => setActiveTab("options")}>
              Retounen
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-2">Deskripsyon</h4>
                <p className="text-finance-charcoal/70 dark:text-white/70">
                  {creditOptions.find(o => o.id === selectedCreditOption)?.description}
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-2">Eligibilite</h4>
                <p className="text-finance-charcoal/70 dark:text-white/70">
                  {creditOptions.find(o => o.id === selectedCreditOption)?.eligibility}
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-2">Dokiman Nesesè</h4>
                <ul className="list-disc pl-5 space-y-1 text-finance-charcoal/70 dark:text-white/70">
                  {creditOptions.find(o => o.id === selectedCreditOption)?.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="rounded-lg border border-finance-midGray/30 dark:border-white/10 p-6">
              <h4 className="text-lg font-medium mb-4">Detay Finansye</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-finance-midGray/30 dark:border-white/10">
                  <span>Montan Maksimòm</span>
                  <span className="font-bold">
                    {creditOptions.find(o => o.id === selectedCreditOption)?.amount.replace("Jiska ", "")}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-finance-midGray/30 dark:border-white/10">
                  <span>Dire</span>
                  <span className="font-bold">
                    {creditOptions.find(o => o.id === selectedCreditOption)?.term}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-finance-midGray/30 dark:border-white/10">
                  <span>To Enterè</span>
                  <span className="font-bold">
                    {creditOptions.find(o => o.id === selectedCreditOption)?.interestRate}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Frè Pwosesis</span>
                  <span className="font-bold">
                    {creditOptions.find(o => o.id === selectedCreditOption)?.processingFee}
                  </span>
                </div>
              </div>
              
              <Button className="w-full mt-6" onClick={() => startLoanApplication(selectedCreditOption)}>
                Aplike Kounye A
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === "apply" && selectedCreditOption && (
        <div className="finance-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="section-title mb-0">
              Aplike pou {creditOptions.find(o => o.id === selectedCreditOption)?.title}
            </h3>
            <Button variant="ghost" onClick={() => setActiveTab("options")}>
              Anile
            </Button>
          </div>
          
          <div className="space-y-6">
            <div className="bg-finance-lightGray/50 dark:bg-white/5 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Enfòmasyon sou Pwodwi</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Tip Kredi</p>
                  <p className="font-medium">{creditOptions.find(o => o.id === selectedCreditOption)?.title}</p>
                </div>
                <div>
                  <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Montan Maksimòm</p>
                  <p className="font-medium">
                    {creditOptions.find(o => o.id === selectedCreditOption)?.amount.replace("Jiska ", "")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Dire</p>
                  <p className="font-medium">{creditOptions.find(o => o.id === selectedCreditOption)?.term}</p>
                </div>
                <div>
                  <p className="text-xs text-finance-charcoal/70 dark:text-white/70">To Enterè</p>
                  <p className="font-medium">{creditOptions.find(o => o.id === selectedCreditOption)?.interestRate}</p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="personal">Enfòmasyon</TabsTrigger>
                <TabsTrigger value="financial">Finansye</TabsTrigger>
                <TabsTrigger value="documents">Dokiman</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Non Konplè</Label>
                    <Input id="full-name" placeholder="Non ou" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dob">Dat Nesans</Label>
                    <Input id="dob" placeholder="MM/DD/YYYY" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="id-number">Nimewo Idantite</Label>
                    <Input id="id-number" placeholder="ID nasyonal ou" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefòn</Label>
                    <Input id="phone" placeholder="Nimewo telefòn ou" />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adrès</Label>
                    <Input id="address" placeholder="Adrès konplè ou" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    Kontinye
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="financial" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employment">Sitiyasyon Travay</Label>
                    <Select>
                      <SelectTrigger id="employment">
                        <SelectValue placeholder="Chwazi opsyon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Anplwaye</SelectItem>
                        <SelectItem value="self-employed">Travayè Endepandan</SelectItem>
                        <SelectItem value="business-owner">Biznis</SelectItem>
                        <SelectItem value="unemployed">San Travay</SelectItem>
                        <SelectItem value="retired">Retrete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monthly-income">Revni Mansyèl</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70">$</span>
                      <Input id="monthly-income" className="pl-8" placeholder="0.00" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loan-amount-apply">Montan Prè</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70">$</span>
                      <Input 
                        id="loan-amount-apply" 
                        value={loanAmount} 
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="pl-8" 
                        placeholder="0.00"
                        type="number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loan-term-apply">Dire Prè</Label>
                    <Select value={loanTerm} onValueChange={setLoanTerm}>
                      <SelectTrigger id="loan-term-apply">
                        <SelectValue placeholder="Chwazi dire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Mwa</SelectItem>
                        <SelectItem value="6">6 Mwa</SelectItem>
                        <SelectItem value="12">12 Mwa</SelectItem>
                        <SelectItem value="24">24 Mwa</SelectItem>
                        <SelectItem value="36">36 Mwa</SelectItem>
                        <SelectItem value="48">48 Mwa</SelectItem>
                        <SelectItem value="60">60 Mwa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="loan-purpose-apply">Rezon Prè</Label>
                    <Select value={loanPurpose} onValueChange={setLoanPurpose}>
                      <SelectTrigger id="loan-purpose-apply">
                        <SelectValue placeholder="Chwazi rezon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emergency">Ijans</SelectItem>
                        <SelectItem value="education">Edikasyon</SelectItem>
                        <SelectItem value="home">Kay / Reparasyon</SelectItem>
                        <SelectItem value="business">Biznis</SelectItem>
                        <SelectItem value="travel">Vwayaj</SelectItem>
                        <SelectItem value="medical">Medikal</SelectItem>
                        <SelectItem value="other">Lòt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    Kontinye
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Pyès Idantite</Label>
                    <div className="border-2 border-dashed border-finance-midGray/30 dark:border-white/10 rounded-lg p-4 text-center">
                      <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-2">
                        Mete fichye ID nasyonal ou (JPG, PNG, PDF)
                      </p>
                      <Button variant="outline" size="sm">Chwazi Fichye</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Prèv Revni</Label>
                    <div className="border-2 border-dashed border-finance-midGray/30 dark:border-white/10 rounded-lg p-4 text-center">
                      <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-2">
                        Mete resi oswa relve bank (JPG, PNG, PDF)
                      </p>
                      <Button variant="outline" size="sm">Chwazi Fichye</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Lòt Dokiman</Label>
                    <div className="border-2 border-dashed border-finance-midGray/30 dark:border-white/10 rounded-lg p-4 text-center">
                      <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-2">
                        Mete lòt dokiman si genyen (JPG, PNG, PDF)
                      </p>
                      <Button variant="outline" size="sm">Chwazi Fichye</Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleApplyForLoan}>
                    Soumèt Demand
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
      
      <div className="finance-card">
        <h3 className="section-title mb-0">Istwa Peman</h3>
        
        <div className="flex justify-between items-center py-3 border-b border-finance-midGray/30 dark:border-white/10">
          <div className="flex-1">
            <p className="font-medium text-sm">Deskripsyon</p>
          </div>
          <div className="flex-1 text-center">
            <p className="font-medium text-sm">Dat</p>
          </div>
          <div className="flex-1 text-right">
            <p className="font-medium text-sm">Montan</p>
          </div>
        </div>
        
        <div className="divide-y divide-finance-midGray/30 dark:divide-white/10">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <p className="text-sm">Peman Mansyèl</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm">15 Jen, 2023</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-finance-success">$120.00</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <p className="text-sm">Peman Mansyèl</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm">15 Me, 2023</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-finance-success">$120.00</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <p className="text-sm">Peman Mansyèl</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm">15 Avril, 2023</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-finance-success">$120.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditSection;
