
import { useState } from 'react';
import { ArrowDown, Check, XIcon, Loader2 } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BankAccount } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'moncash' | 'natcash' | 'agent' | 'card'>('moncash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'confirmation' | 'processing' | 'success' | 'error'>('form');
  const [transactionInfo, setTransactionInfo] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const proceedToDeposit = async () => {
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

    if (!depositAmount || Number(depositAmount) <= 0) {
      toast({
        title: "Montan envalid",
        description: "Montan depo a dwe pi plis ke zewo.",
        variant: "destructive"
      });
      return;
    }

    if ((paymentMethod === 'moncash' || paymentMethod === 'natcash') && !phoneNumber) {
      toast({
        title: "Nimewo telefòn manke",
        description: "Tanpri antre nimewo telefòn ou.",
        variant: "destructive"
      });
      return;
    }

    setStep('processing');
    setProcessing(true);

    try {
      if (paymentMethod === 'card') {
        // Direct deposit handling (simulated instant bank transfer)
        await handleDeposit();
        setStep('success');
      } else {
        // Mobile money handling (MonCash/NatCash)
        // Call the payment-gateway Edge Function to initialize the payment
        const { data: response, error } = await supabase.functions.invoke('payment-gateway', {
          body: {
            method: paymentMethod,
            amount: Number(depositAmount),
            phone: phoneNumber,
            userId: user.id,
            accountId: selectedAccountId,
            description: `Depo via ${paymentMethod}`
          }
        });

        if (error) {
          console.error('Error initializing payment:', error);
          toast({
            title: "Echèk nan inisyalize peman",
            description: error.message || "Nou pa t kapab inisyalize peman an. Tanpri eseye ankò.",
            variant: "destructive"
          });
          setStep('error');
          return;
        }

        if (response.success) {
          setTransactionInfo(response);
          setStep('confirmation');
        } else {
          toast({
            title: "Echèk nan inisyalize peman",
            description: response.error || "Nou pa t kapab inisyalize peman an. Tanpri eseye ankò.",
            variant: "destructive"
          });
          setStep('error');
        }
      }
    } catch (error) {
      console.error('Error processing deposit:', error);
      toast({
        title: "Depo echwe",
        description: "Gen yon erè ki pase pandan n ap eseye fè depo a.",
        variant: "destructive"
      });
      setStep('error');
    } finally {
      setProcessing(false);
    }
  };

  const verifyPayment = async () => {
    if (!transactionInfo || !transactionInfo.transaction) {
      return;
    }

    setStep('processing');
    setProcessing(true);

    try {
      const { data: response, error } = await supabase.functions.invoke('payment-gateway', {
        body: {
          transactionId: transactionInfo.transaction.id
        },
        functionName: 'verify'
      });

      if (error) {
        console.error('Error verifying payment:', error);
        toast({
          title: "Echèk nan verifye peman",
          description: error.message || "Nou pa t kapab verifye peman an. Tanpri eseye ankò.",
          variant: "destructive"
        });
        setStep('error');
        return;
      }

      if (response.success) {
        toast({
          title: "Depo reyisi",
          description: `Ou depoze $${depositAmount} nan kont ou`,
        });
        setStep('success');
        // Reset form
        setDepositAmount("");
        setPhoneNumber("");
      } else {
        toast({
          title: "Peman echwe",
          description: response.message || "Peman an pa t reyisi. Tanpri eseye ankò.",
          variant: "destructive"
        });
        setStep('error');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Echèk nan verifye peman",
        description: "Gen yon erè ki pase pandan n ap eseye verifye peman an.",
        variant: "destructive"
      });
      setStep('error');
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setStep('form');
    setTransactionInfo(null);
    setDepositAmount("");
    setPhoneNumber("");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    // Reset the form when dialog is closed
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-finance-green hover:bg-finance-green/90">
          <ArrowDown className="h-4 w-4 mr-2" />
          Depoze
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => step === 'processing' && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Depoze Lajan</DialogTitle>
          <DialogDescription>
            {step === 'form' && "Chwazi yon metòd pou depoze lajan nan kont ou."}
            {step === 'confirmation' && "Konfime enfòmasyon peman ou."}
            {step === 'processing' && "Nap trete peman ou..."}
            {step === 'success' && "Peman ou reyisi!"}
            {step === 'error' && "Gen yon erè ki rive pandan peman an."}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-4">
            {accounts.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="account">Kont</Label>
                <Select 
                  value={selectedAccountId || ''} 
                  onValueChange={setSelectedAccountId}
                >
                  <SelectTrigger id="account">
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
              <Label htmlFor="amount">Montan</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input 
                  id="amount" 
                  value={depositAmount} 
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="pl-8" 
                  placeholder="0.00"
                  type="number"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Metòd Peman</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  type="button" 
                  variant={paymentMethod === 'moncash' ? 'default' : 'outline'} 
                  onClick={() => setPaymentMethod('moncash')}
                  className="w-full"
                >
                  MonCash
                </Button>
                <Button 
                  type="button" 
                  variant={paymentMethod === 'natcash' ? 'default' : 'outline'} 
                  onClick={() => setPaymentMethod('natcash')}
                  className="w-full"
                >
                  NatCash
                </Button>
                <Button 
                  type="button" 
                  variant={paymentMethod === 'agent' ? 'default' : 'outline'} 
                  onClick={() => setPaymentMethod('agent')}
                  className="w-full"
                >
                  Ajan
                </Button>
                <Button 
                  type="button" 
                  variant={paymentMethod === 'card' ? 'default' : 'outline'} 
                  onClick={() => setPaymentMethod('card')}
                  className="w-full"
                >
                  Kat
                </Button>
              </div>
            </div>
            
            {(paymentMethod === 'moncash' || paymentMethod === 'natcash') && (
              <div className="space-y-2">
                <Label htmlFor="phone">Nimewo Telefòn</Label>
                <Input 
                  id="phone" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Antre nimewo telefòn ou"
                />
              </div>
            )}
            
            <Button 
              onClick={proceedToDeposit} 
              className="w-full"
              disabled={processingDeposit || !depositAmount || !selectedAccountId || ((paymentMethod === 'moncash' || paymentMethod === 'natcash') && !phoneNumber)}
            >
              {processingDeposit ? 'Ap trete...' : 'Kontinye'}
            </Button>
          </div>
        )}

        {step === 'confirmation' && transactionInfo && (
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Metòd:</span>
                <span className="font-medium">{paymentMethod === 'moncash' ? 'MonCash' : 'NatCash'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nimewo Telefòn:</span>
                <span className="font-medium">{phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Montan:</span>
                <span className="font-medium">${depositAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Referans:</span>
                <span className="font-medium">{transactionInfo.transaction.id.substring(0, 8)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Tanpri swiv enstriksyon {paymentMethod === 'moncash' ? 'MonCash' : 'NatCash'} pou konplete peman an.
              </p>
              <p className="text-sm text-gray-500">
                Aprè ou fin peye, klike sou "Verifye Peman" pou konfime depo a.
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={resetForm}
              >
                <XIcon className="h-4 w-4 mr-2" />
                Anile
              </Button>
              <Button 
                className="flex-1"
                onClick={verifyPayment}
              >
                <Check className="h-4 w-4 mr-2" />
                Verifye Peman
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-12 w-12 animate-spin text-finance-blue mb-4" />
            <p>Tanpri tann pandan nou trete peman ou...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Depo Reyisi!</h3>
            <p className="text-center text-gray-500 mb-4">
              Depo ou a te trete avèk siksè. Balans ou a te ajou.
            </p>
            <Button 
              onClick={handleCloseDialog}
              className="w-full"
            >
              Fèmen
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <XIcon className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Depo Echwe</h3>
            <p className="text-center text-gray-500 mb-4">
              Te gen yon erè pandan nou t ap trete depo ou a. Tanpri eseye ankò.
            </p>
            <div className="flex space-x-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleCloseDialog}
              >
                Fèmen
              </Button>
              <Button 
                className="flex-1"
                onClick={() => setStep('form')}
              >
                Eseye Ankò
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
