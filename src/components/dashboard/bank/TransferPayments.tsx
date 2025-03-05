
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { BankAccount } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabase';
import { useTransactions } from '@/hooks/useTransactions';
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, QrCode, Smartphone, BanknoteIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TransferPaymentsProps {
  bankAccounts: BankAccount[];
  user: User | null;
  refreshProfile: () => Promise<void>;
}

const TransferPayments = ({ bankAccounts, user, refreshProfile }: TransferPaymentsProps) => {
  const [activeTab, setActiveTab] = useState('transfer');
  const { toast } = useToast();
  const { addTransaction } = useTransactions(user?.id);

  // Transfer states
  const [transferAmount, setTransferAmount] = useState(0);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [transferDescription, setTransferDescription] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(bankAccounts[0]?.id || '');
  const [isTransferring, setIsTransferring] = useState(false);
  
  // Recurring payment states
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentName, setPaymentName] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [isRecurring, setIsRecurring] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);

  // Handle transfer
  const handleTransfer = async () => {
    if (!selectedAccount) {
      toast({
        title: "Erè transfè",
        description: "Seleksyone yon kont pou fè transfè a.",
        variant: "destructive"
      });
      return;
    }
    
    if (transferAmount <= 0) {
      toast({
        title: "Erè transfè",
        description: "Antre yon montan ki pozitif.",
        variant: "destructive"
      });
      return;
    }
    
    if (!recipientPhone) {
      toast({
        title: "Erè transfè",
        description: "Antre nimewo telefòn destinatè a.",
        variant: "destructive"
      });
      return;
    }
    
    const account = bankAccounts.find(acc => acc.id === selectedAccount);
    if (!account) {
      toast({
        title: "Erè transfè",
        description: "Kont la pa valid.",
        variant: "destructive"
      });
      return;
    }
    
    if (transferAmount > account.balance) {
      toast({
        title: "Erè transfè",
        description: "Ou pa gen ase lajan nan kont ou a.",
        variant: "destructive"
      });
      return;
    }
    
    setIsTransferring(true);
    
    try {
      // In a real app, you would validate recipient and process transfer
      // For this demo, we'll just update the sender's account
      
      // Update sender's account balance
      const { error: balanceError } = await supabase
        .from('bank_accounts')
        .update({ 
          balance: account.balance - transferAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', account.id);

      if (balanceError) throw balanceError;

      // Create a transaction record
      await addTransaction({
        amount: -transferAmount, // Negative for outgoing transfer
        transaction_type: 'transfer',
        description: `Transfè a ${recipientPhone}${transferDescription ? ': ' + transferDescription : ''}`,
        account_id: account.id,
        user_id: user!.id
      });

      // Refresh profile to get updated accounts
      await refreshProfile();
      
      // Reset form
      setTransferAmount(0);
      setTransferDescription('');
      
      toast({
        title: "Transfè reyisi",
        description: `${transferAmount} HTG transfere a ${recipientPhone}.`,
      });
    } catch (error: any) {
      console.error('Error transferring:', error);
      toast({
        title: "Erè transfè",
        description: error.message || "Pa kapab fè transfè a. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setIsTransferring(false);
    }
  };

  // Handle schedule payment
  const handleSchedulePayment = async () => {
    if (!selectedAccount) {
      toast({
        title: "Erè pwogramasyon",
        description: "Seleksyone yon kont pou pwograme peman an.",
        variant: "destructive"
      });
      return;
    }
    
    if (paymentAmount <= 0) {
      toast({
        title: "Erè pwogramasyon",
        description: "Antre yon montan ki pozitif.",
        variant: "destructive"
      });
      return;
    }
    
    if (!paymentName) {
      toast({
        title: "Erè pwogramasyon",
        description: "Antre yon non pou peman an.",
        variant: "destructive"
      });
      return;
    }
    
    if (!paymentDate) {
      toast({
        title: "Erè pwogramasyon",
        description: "Chwazi yon dat pou peman an.",
        variant: "destructive"
      });
      return;
    }
    
    setIsScheduling(true);
    
    try {
      // In a real app, this would create a scheduled payment in the database
      // For this demo, we'll just show a success message
      
      setTimeout(() => {
        // Reset form
        setPaymentAmount(0);
        setPaymentName('');
        setPaymentDescription('');
        setPaymentDate(new Date());
        setPaymentFrequency('monthly');
        
        toast({
          title: "Peman pwograme",
          description: `${paymentName} pwograme pou ${format(paymentDate, 'dd/MM/yyyy')}.`,
        });
      }, 1000);
    } catch (error: any) {
      console.error('Error scheduling payment:', error);
      toast({
        title: "Erè pwogramasyon",
        description: error.message || "Pa kapab pwograme peman an. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  // Generate QR for transfer
  const handleGenerateQR = () => {
    toast({
      title: "Fonksyon pako disponib",
      description: "Jenerasyon kòd QR ap disponib byento.",
    });
  };

  // Link bank via Plaid
  const handleLinkBank = () => {
    toast({
      title: "Fonksyon pako disponib",
      description: "Entegrasyon ak lòt bank ap disponib byento.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="transfer">Transfè Rapid</TabsTrigger>
          <TabsTrigger value="recurring">Peman Rekiran</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transfer" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transfè pa Nimewo Telefòn</CardTitle>
                <CardDescription>Voye lajan bay yon moun lè w itilize nimewo telefòn yo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="source-account">Soti nan Kont</Label>
                  <Select 
                    value={selectedAccount} 
                    onValueChange={setSelectedAccount}
                    disabled={bankAccounts.length === 0}
                  >
                    <SelectTrigger id="source-account">
                      <SelectValue placeholder="Chwazi kont" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.account_name} - {account.currency} {account.balance.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recipient-phone">Nimewo Telefòn Destinatè</Label>
                  <div className="flex">
                    <Input
                      id="recipient-phone"
                      placeholder="+509"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={handleGenerateQR}
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transfer-amount">Montan</Label>
                  <Input
                    id="transfer-amount"
                    type="number"
                    min="0"
                    value={transferAmount || ''}
                    onChange={(e) => setTransferAmount(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transfer-description">Deskripsyon (opsyonèl)</Label>
                  <Input
                    id="transfer-description"
                    placeholder="Rezon transfè a"
                    value={transferDescription}
                    onChange={(e) => setTransferDescription(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleTransfer}
                  disabled={isTransferring || !selectedAccount || transferAmount <= 0 || !recipientPhone}
                >
                  {isTransferring ? "Ap transfère..." : "Transfère Kounye a"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Konekte ak Bank Ou</CardTitle>
                <CardDescription>Ajoute lòt kont bank ou yo pou transfè pi fasil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-6 text-center space-y-4">
                  <BanknoteIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="font-medium text-lg">Konekte ak Lòt Bank</h3>
                  <p className="text-sm text-muted-foreground">
                    Konekte ak kont bank ou yo nan lòt enstitisyon finansye pou w ka wè tout finansman ou yo nan yon sèl kote.
                  </p>
                  <Button onClick={handleLinkBank}>Konekte Kont Bank</Button>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium mb-2">Metòd Transfè</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 mr-2 text-primary" />
                        <span>Transfè Mobil</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Aktif
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center">
                        <QrCode className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>Transfè pa QR</span>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                        Byento
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recurring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pwograme Peman</CardTitle>
                <CardDescription>Konfigire peman otomatik pou fakti ak lòt depans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-source-account">Soti nan Kont</Label>
                  <Select 
                    value={selectedAccount} 
                    onValueChange={setSelectedAccount}
                    disabled={bankAccounts.length === 0}
                  >
                    <SelectTrigger id="payment-source-account">
                      <SelectValue placeholder="Chwazi kont" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.account_name} - {account.currency} {account.balance.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-name">Non Peman</Label>
                  <Input
                    id="payment-name"
                    placeholder="Pa egzanp: Lwaye, Elektrisite"
                    value={paymentName}
                    onChange={(e) => setPaymentName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-amount">Montan</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    min="0"
                    value={paymentAmount || ''}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-date">Dat Peman</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paymentDate ? format(paymentDate, 'PP') : <span>Chwazi yon dat</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={paymentDate}
                        onSelect={setPaymentDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-frequency">Frekans</Label>
                  <Select 
                    value={paymentFrequency} 
                    onValueChange={setPaymentFrequency}
                    disabled={!isRecurring}
                  >
                    <SelectTrigger id="payment-frequency">
                      <SelectValue placeholder="Chwazi frekans" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Yon sèl fwa</SelectItem>
                      <SelectItem value="weekly">Chak semèn</SelectItem>
                      <SelectItem value="biweekly">Chak 2 semèn</SelectItem>
                      <SelectItem value="monthly">Chak mwa</SelectItem>
                      <SelectItem value="quarterly">Chak 3 mwa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="recurring" 
                    checked={isRecurring}
                    onCheckedChange={(checked) => setIsRecurring(checked === true)}
                  />
                  <label
                    htmlFor="recurring"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Peman rekiran
                  </label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-description">Nòt (opsyonèl)</Label>
                  <Input
                    id="payment-description"
                    placeholder="Nòt adisyonèl"
                    value={paymentDescription}
                    onChange={(e) => setPaymentDescription(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleSchedulePayment}
                  disabled={isScheduling || !selectedAccount || paymentAmount <= 0 || !paymentName || !paymentDate}
                >
                  {isScheduling ? "Ap pwograme..." : "Pwograme Peman"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Peman Pwograme</CardTitle>
                <CardDescription>Jere peman otomatik ou yo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="p-6 flex flex-col items-center justify-center h-64 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">Pa gen peman pwograme</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ou poko gen okenn peman rekiran ki pwograme. Pwograme premye ou!
                    </p>
                    <Button variant="outline" onClick={() => setActiveTab('recurring')}>
                      Kreye Peman Rekiran
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransferPayments;
