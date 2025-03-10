
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Copy, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle,
  PlusCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VirtualCard as VirtualCardType } from '@/hooks/useVirtualCard';

export interface VirtualCardProps {
  card: VirtualCardType;
  topUpVirtualCard: (cardId: string, amount: number, sourceAccountId: string) => Promise<any>;
  deactivateVirtualCard: (cardId: string) => Promise<any>;
}

export const VirtualCard = ({ card, topUpVirtualCard, deactivateVirtualCard }: VirtualCardProps) => {
  const { toast } = useToast();
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  // Format card number with spaces for display
  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || cardNumber;
  };

  // Copy card details to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copied`,
      description: `${label} has been copied to clipboard.`,
    });
  };

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      // For now, we're using a dummy account ID. In reality, this would come from selected account
      await topUpVirtualCard(card.id, parseFloat(topUpAmount), "default-account-id");
      setShowTopUpDialog(false);
      setTopUpAmount("");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeactivate = async () => {
    if (confirm("Are you sure you want to deactivate this card? This action cannot be undone.")) {
      await deactivateVirtualCard(card.id);
    }
  };

  return (
    <Card className={`overflow-hidden ${card.status !== 'active' ? 'opacity-70' : ''}`}>
      <CardContent className="p-0">
        <div className="bg-finance-blue dark:bg-finance-blue/80 text-white p-4 pt-3 pb-8 relative">
          <div className="flex justify-between items-start">
            <CreditCard className="h-8 w-8" />
            <Badge variant={card.status === 'active' ? 'outline' : 'destructive'} className="bg-white/10">
              {card.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-80">Card Number</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white" 
                onClick={() => setShowCardDetails(!showCardDetails)}
              >
                {showCardDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="font-mono text-lg font-medium flex items-center">
              {showCardDetails ? formatCardNumber(card.card_number) : '•••• •••• •••• ' + card.card_number.slice(-4)}
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-1 h-6 w-6 text-white" 
                onClick={() => copyToClipboard(card.card_number, "Card number")}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div>
              <div className="text-xs opacity-80">Cardholder</div>
              <div className="text-sm font-medium truncate">{card.holder_name}</div>
            </div>
            <div>
              <div className="text-xs opacity-80">Expires</div>
              <div className="text-sm font-medium">{card.expiry_date}</div>
            </div>
            <div>
              <div className="text-xs opacity-80">CVV</div>
              <div className="text-sm font-medium flex items-center">
                {showCardDetails ? card.cvv : '•••'}
                {showCardDetails && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-1 h-6 w-6 text-white" 
                    onClick={() => copyToClipboard(card.cvv, "CVV")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 right-0 left-0 h-6 bg-gradient-to-r from-finance-darkBlue via-finance-blue to-finance-darkBlue opacity-70"></div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Balance</div>
              <div className="text-2xl font-bold">${card.balance.toFixed(2)}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              Created {new Date(card.created_at).toLocaleDateString()}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex gap-2 justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowTopUpDialog(true)}
              disabled={card.status !== 'active'}
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Top Up
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleDeactivate}
              disabled={card.status !== 'active'}
            >
              <ShieldAlert className="mr-1 h-4 w-4" />
              Deactivate
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Top Up Dialog */}
      <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
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
              <Label htmlFor="topUpAmount">Top Up Amount</Label>
              <Input
                id="topUpAmount"
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTopUpDialog(false)}>
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
    </Card>
  );
};
