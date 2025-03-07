
import { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BankAccount } from '@/hooks/useBankData';

interface DepositDialogProps {
  accounts: BankAccount[];
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string) => void;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  depositMethod: string;
  setDepositMethod: (method: string) => void;
  handleDeposit: () => Promise<void>;
  processingDeposit: boolean;
}

export const DepositDialog = ({
  accounts,
  selectedAccountId,
  setSelectedAccountId,
  depositAmount,
  setDepositAmount,
  depositMethod,
  setDepositMethod,
  handleDeposit,
  processingDeposit
}: DepositDialogProps) => {
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
  );
};
