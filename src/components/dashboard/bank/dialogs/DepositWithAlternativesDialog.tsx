
import { useState } from 'react';
import { ArrowDown, Phone, CreditCard, MapPin, QrCode } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BankAccount } from '@/hooks/useBankData';
import { useToast } from '@/hooks/use-toast';

interface DepositWithAlternativesDialogProps {
  accounts: BankAccount[];
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string) => void;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  handleDeposit: () => Promise<void>;
  processingDeposit: boolean;
}

export const DepositWithAlternativesDialog = ({
  accounts,
  selectedAccountId,
  setSelectedAccountId,
  depositAmount,
  setDepositAmount,
  handleDeposit,
  processingDeposit
}: DepositWithAlternativesDialogProps) => {
  const { toast } = useToast();
  const [depositMethod, setDepositMethod] = useState('card');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showQR, setShowQR] = useState(false);
  
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

  // Generate a QR code (in a real app, this would contain actual data)
  const generateQRCode = () => {
    setShowQR(true);
    toast({
      title: "Kòd QR Jenere",
      description: "Prezante kòd sa a bay ajan yo pou yo ka trete depo a.",
    });
  };

  // Mock function to simulate mobile money deposit
  const handleMobileMoneyDeposit = () => {
    if (!mobileNumber || mobileNumber.length < 8) {
      toast({
        title: "Nimewo telefòn envalid",
        description: "Tanpri antre yon nimewo telefòn valid.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Redireksyon...",
      description: `Nou pral voye ou nan pòtay ${depositMethod === 'moncash' ? 'MonCash' : 'NatCash'} pou konfime peman an.`,
    });

    // In a real app, this would redirect to the payment gateway
    setTimeout(() => {
      handleDeposit();
    }, 2000);
  };

  const handleAgentDeposit = () => {
    if (!showQR) {
      generateQRCode();
      return;
    }
    
    handleDeposit();
  };

  return (
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
        
        <Tabs defaultValue="card" onValueChange={setDepositMethod} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="card">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Kat</span>
            </TabsTrigger>
            <TabsTrigger value="moncash">
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">MonCash</span>
            </TabsTrigger>
            <TabsTrigger value="natcash">
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">NatCash</span>
            </TabsTrigger>
            <TabsTrigger value="agent">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Ajan</span>
            </TabsTrigger>
          </TabsList>
          
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
          </div>
          
          <TabsContent value="card" className="space-y-4">
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
            
            <Button 
              onClick={handleDeposit} 
              disabled={processingDeposit || !depositAmount || !selectedAccountId}
              className="w-full"
            >
              {processingDeposit ? 'Ap trete...' : 'Depoze Lajan'}
            </Button>
          </TabsContent>
          
          <TabsContent value="moncash" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="moncash-phone">Nimewo MonCash</Label>
              <Input 
                id="moncash-phone" 
                placeholder="509XXXXXXXX" 
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                Nou pral voye yon demand peman bay nimewo MonCash ou.
              </p>
            </div>
            
            <Button 
              onClick={handleMobileMoneyDeposit} 
              disabled={processingDeposit || !depositAmount || !selectedAccountId || !mobileNumber}
              className="w-full"
            >
              {processingDeposit ? 'Ap trete...' : 'Kontinye ak MonCash'}
            </Button>
          </TabsContent>
          
          <TabsContent value="natcash" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="natcash-phone">Nimewo NatCash</Label>
              <Input 
                id="natcash-phone" 
                placeholder="509XXXXXXXX" 
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                Nou pral voye yon demand peman bay nimewo NatCash ou.
              </p>
            </div>
            
            <Button 
              onClick={handleMobileMoneyDeposit} 
              disabled={processingDeposit || !depositAmount || !selectedAccountId || !mobileNumber}
              className="w-full"
            >
              {processingDeposit ? 'Ap trete...' : 'Kontinye ak NatCash'}
            </Button>
          </TabsContent>
          
          <TabsContent value="agent" className="space-y-4">
            {!showQR ? (
              <>
                <div className="space-y-2">
                  <Label>Ajan Otorize Toupre</Label>
                  <div className="border rounded-md divide-y">
                    <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                      <p className="font-medium">MyCash Agent - Downtown</p>
                      <p className="text-sm text-finance-charcoal/70 dark:text-white/70">123 Rue Capois, Port-au-Prince</p>
                    </div>
                    <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                      <p className="font-medium">QuickPay Agent - Delmas</p>
                      <p className="text-sm text-finance-charcoal/70 dark:text-white/70">45 Route de Delmas, Delmas</p>
                    </div>
                    <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                      <p className="font-medium">SecureCash - Pétion-Ville</p>
                      <p className="text-sm text-finance-charcoal/70 dark:text-white/70">78 Avenue John Brown, Pétion-Ville</p>
                    </div>
                  </div>
                </div>
              
                <Button 
                  onClick={generateQRCode} 
                  disabled={processingDeposit || !depositAmount || !selectedAccountId}
                  className="w-full"
                >
                  Jenere Kòd QR
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2 flex flex-col items-center">
                  <p className="font-medium">Prezante kòd sa a bay ajan an</p>
                  <div className="w-48 h-48 bg-white p-4 rounded-lg flex items-center justify-center">
                    <QrCode className="w-full h-full" />
                  </div>
                  <p className="text-center text-sm text-finance-charcoal/70 dark:text-white/70">
                    Kòd referans: <span className="font-mono font-bold">AG-{Math.floor(10000 + Math.random() * 90000)}</span>
                  </p>
                </div>
              
                <Button 
                  onClick={handleAgentDeposit} 
                  disabled={processingDeposit}
                  className="w-full"
                >
                  {processingDeposit ? 'Ap trete...' : 'Konfime Depo'}
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
