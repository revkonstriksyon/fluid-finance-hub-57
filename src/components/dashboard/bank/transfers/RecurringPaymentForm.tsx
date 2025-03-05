
import { useState } from 'react';
import { BankAccount } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface RecurringPaymentFormProps {
  bankAccounts: BankAccount[];
  selectedAccount: string;
  setSelectedAccount: (accountId: string) => void;
}

const RecurringPaymentForm = ({ 
  bankAccounts, 
  selectedAccount, 
  setSelectedAccount 
}: RecurringPaymentFormProps) => {
  const { toast } = useToast();
  
  // Recurring payment states
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentName, setPaymentName] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [isRecurring, setIsRecurring] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);

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

  return (
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
  );
};

export default RecurringPaymentForm;
