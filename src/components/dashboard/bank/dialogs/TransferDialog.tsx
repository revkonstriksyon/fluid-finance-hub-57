
import { useState } from 'react';
import { ArrowUp, Search, UserIcon, CreditCard } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BankAccount } from '@/hooks/useBankData';
import { UserSearchForTransfer } from "@/components/dashboard/UserSearchForTransfer";

interface TransferDialogProps {
  accounts: BankAccount[];
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  recipientName: string;
  setRecipientName: (name: string) => void;
  recipientAccount: string;
  setRecipientAccount: (account: string) => void;
  transferPurpose: string;
  setTransferPurpose: (purpose: string) => void;
  paymentCategory: string;
  setPaymentCategory: (category: string) => void;
  transferMode: 'account' | 'user';
  setTransferMode: (mode: 'account' | 'user') => void;
  selectedUserId: string | null;
  selectedUserEmail: string;
  handleUserSelect: (userId: string, userEmail: string) => void;
  handleTransfer: () => Promise<void>;
  processingTransfer: boolean;
  billProvider: string;
  setBillProvider: (provider: string) => void;
  billAccount: string;
  setBillAccount: (account: string) => void;
  billAmount: string;
  setBillAmount: (amount: string) => void;
  handlePayBill: () => Promise<void>;
  processingBill: boolean;
}

export const TransferDialog = ({
  accounts,
  selectedAccountId,
  setSelectedAccountId,
  amount,
  setAmount,
  recipientName,
  setRecipientName,
  recipientAccount,
  setRecipientAccount,
  transferPurpose,
  setTransferPurpose,
  paymentCategory,
  setPaymentCategory,
  transferMode,
  setTransferMode,
  selectedUserId,
  selectedUserEmail,
  handleUserSelect,
  handleTransfer,
  processingTransfer,
  billProvider,
  setBillProvider,
  billAccount,
  setBillAccount,
  billAmount,
  setBillAmount,
  handlePayBill,
  processingBill
}: TransferDialogProps) => {
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
              <Label>Tip Transfè</Label>
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant={transferMode === 'account' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => setTransferMode('account')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Kont
                </Button>
                <Button 
                  type="button" 
                  variant={transferMode === 'user' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => setTransferMode('user')}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Itilizatè
                </Button>
              </div>
            </div>
            
            {transferMode === 'account' ? (
              <>
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
              </>
            ) : (
              <UserSearchForTransfer onUserSelect={handleUserSelect} />
            )}
            
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
            
            {transferMode === 'user' && selectedUserEmail && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm">
                  Transfè pral ale bay: <span className="font-medium">{selectedUserEmail}</span>
                </p>
              </div>
            )}
            
            <Button 
              onClick={handleTransfer} 
              className="w-full"
              disabled={
                processingTransfer || !amount || !transferPurpose || !selectedAccountId || 
                (transferMode === 'account' && (!recipientName || !recipientAccount)) ||
                (transferMode === 'user' && !selectedUserId)
              }
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
  );
};
