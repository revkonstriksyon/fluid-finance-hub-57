
import { useState, useEffect } from 'react';
import { Receipt, Search } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BankAccount } from '@/hooks/useBankData';
import { useBillPayments } from '@/hooks/useBillPayments';
import { Bill } from '@/types/auth';

interface BillPaymentDialogProps {
  accounts: BankAccount[];
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string) => void;
}

export const BillPaymentDialog = ({
  accounts,
  selectedAccountId,
  setSelectedAccountId,
}: BillPaymentDialogProps) => {
  const { payBill, processing, getRecentUnpaidBills } = useBillPayments();
  const [billType, setBillType] = useState<'electricity' | 'water' | 'rent' | 'internet'>('electricity');
  const [billNumber, setBillNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const [billProvider, setBillProvider] = useState('');
  const [showRecent, setShowRecent] = useState(false);
  
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

  // Format bill type for display
  const formatBillType = (type: string) => {
    switch(type) {
      case 'electricity': return 'Elektrisite';
      case 'water': return 'Dlo';
      case 'rent': return 'Lwaye';
      case 'internet': return 'Entènèt';
      default: return type;
    }
  };

  // Get provider options based on bill type
  const getProviderOptions = (type: string) => {
    switch(type) {
      case 'electricity':
        return [
          { value: 'EDH', label: 'EDH' },
          { value: 'SOGENER', label: 'SOGENER' }
        ];
      case 'water':
        return [
          { value: 'DINEPA', label: 'DINEPA' },
          { value: 'CAMEP', label: 'CAMEP' }
        ];
      case 'internet':
        return [
          { value: 'NATCOM', label: 'NATCOM' },
          { value: 'DIGICEL', label: 'DIGICEL' },
          { value: 'ACCESS HAITI', label: 'ACCESS HAITI' }
        ];
      case 'rent':
        return [
          { value: 'LANDLORD', label: 'Mèt Kay' },
          { value: 'PROPERTY MANAGER', label: 'Jesyonè Pwopriyete' }
        ];
      default:
        return [];
    }
  };

  // Load recent bills when bill type changes
  useEffect(() => {
    const loadRecentBills = async () => {
      const bills = await getRecentUnpaidBills(billType);
      setRecentBills(bills);
    };
    
    loadRecentBills();
  }, [billType, getRecentUnpaidBills]);

  // Handle bill payment
  const handlePayBill = async () => {
    if (!selectedAccountId || !billType || !billNumber || !amount || !billProvider) {
      return;
    }
    
    const result = await payBill(
      selectedAccountId,
      billType,
      billNumber,
      parseFloat(amount),
      billProvider
    );
    
    if (result.success) {
      // Reset form
      setBillNumber('');
      setAmount('');
      setBillProvider('');
    }
  };

  // Fill form with a recent bill
  const selectRecentBill = (bill: Bill) => {
    setBillNumber(bill.bill_number);
    setAmount(bill.amount.toString());
    setShowRecent(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
          <Receipt className="h-4 w-4 mr-2" />
          Peye Fakti
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Peye Fakti</DialogTitle>
          <DialogDescription>
            Antre enfòmasyon fakti a epi peye li.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {accounts.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="bill-account">Kont</Label>
              <Select 
                value={selectedAccountId || ''} 
                onValueChange={setSelectedAccountId}
              >
                <SelectTrigger id="bill-account">
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
            <Label htmlFor="bill-type">Tip Fakti</Label>
            <Select 
              value={billType} 
              onValueChange={(value: 'electricity' | 'water' | 'rent' | 'internet') => {
                setBillType(value);
                setBillProvider('');
              }}
            >
              <SelectTrigger id="bill-type">
                <SelectValue placeholder="Chwazi tip fakti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electricity">Elektrisite</SelectItem>
                <SelectItem value="water">Dlo</SelectItem>
                <SelectItem value="rent">Lwaye</SelectItem>
                <SelectItem value="internet">Entènèt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bill-provider">Konpayi</Label>
            <Select 
              value={billProvider} 
              onValueChange={setBillProvider}
            >
              <SelectTrigger id="bill-provider">
                <SelectValue placeholder="Chwazi konpayi" />
              </SelectTrigger>
              <SelectContent>
                {getProviderOptions(billType).map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="bill-number">Nimewo Fakti</Label>
              {recentBills.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={() => setShowRecent(!showRecent)}
                >
                  <Search className="h-3 w-3 mr-1" />
                  Dènye Fakti
                </Button>
              )}
            </div>
            <Input 
              id="bill-number" 
              value={billNumber} 
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="Eg. 12345678"
            />
            
            {showRecent && recentBills.length > 0 && (
              <div className="mt-1 border rounded-md divide-y">
                {recentBills.map(bill => (
                  <div 
                    key={bill.id} 
                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => selectRecentBill(bill)}
                  >
                    <p className="text-sm font-medium">{formatBillType(bill.type)} - #{bill.bill_number}</p>
                    <p className="text-xs text-finance-charcoal/70 dark:text-white/70">${bill.amount}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bill-amount">Montan</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70">$</span>
              <Input 
                id="bill-amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8" 
                placeholder="0.00"
                type="number"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handlePayBill} 
            disabled={processing || !selectedAccountId || !billType || !billNumber || !amount || !billProvider}
            className="w-full"
          >
            {processing ? 'Ap trete...' : 'Peye Fakti'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
