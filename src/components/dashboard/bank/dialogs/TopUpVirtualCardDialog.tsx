
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VirtualCard } from '@/hooks/useVirtualCard';
import { BankAccount } from '@/hooks/useBankData';

interface TopUpVirtualCardDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  card: VirtualCard;
  accounts: BankAccount[];
  onTopUp: (cardId: string, amount: number, sourceAccountId: string) => Promise<any>;
}

const TopUpVirtualCardDialog = ({
  open,
  setOpen,
  card,
  accounts,
  onTopUp
}: TopUpVirtualCardDialogProps) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (!sourceAccountId) {
      toast({
        title: "No account selected",
        description: "Please select a source account for the top up.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      await onTopUp(card.id, parseFloat(amount), sourceAccountId);
      setOpen(false);
      setAmount("");
      setSourceAccountId("");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Top Up Virtual Card</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Card Number</span>
            <span className="font-mono">•••• {card.card_number.slice(-4)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Balance</span>
            <span className="font-bold">${card.balance.toFixed(2)}</span>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="sourceAccount">Source Account</Label>
            <select 
              id="sourceAccount"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={sourceAccountId}
              onChange={(e) => setSourceAccountId(e.target.value)}
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_name} - ${account.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topUpAmount">Top Up Amount</Label>
            <Input
              id="topUpAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleTopUp} disabled={processing}>
            {processing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Top Up
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpVirtualCardDialog;
