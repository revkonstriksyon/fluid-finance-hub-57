
import { useState } from 'react';
import { PlusCircle, ShoppingCart, Shield, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { useVirtualCards } from '@/hooks/useVirtualCards';
import { VirtualCard } from './VirtualCard';
import { VirtualCard as VirtualCardType } from '@/types/auth';

export const VirtualCardsSection = () => {
  const { cards, loading, createCard, simulateTransaction } = useVirtualCards();
  const [initialBalance, setInitialBalance] = useState("");
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [selectedCard, setSelectedCard] = useState<VirtualCardType | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseDescription, setPurchaseDescription] = useState("");
  const [processing, setProcessing] = useState(false);

  // Track if a card creation is in progress
  const [creating, setCreating] = useState(false);

  // Handle generate card
  const handleGenerateCard = async () => {
    if (!initialBalance || parseFloat(initialBalance) <= 0) return;
    
    setCreating(true);
    try {
      const result = await createCard();
      if (result.success) {
        setShowCreateCard(false);
        setInitialBalance("");
      }
    } finally {
      setCreating(false);
    }
  };

  // Handle simulate purchase
  const handleSimulatePurchase = async () => {
    if (!selectedCard || !purchaseAmount || !purchaseDescription) return;
    
    setProcessing(true);
    try {
      const result = await simulateTransaction(
        selectedCard.id, 
        parseFloat(purchaseAmount), 
        purchaseDescription
      );
      
      if (result.success) {
        setShowPurchase(false);
        setPurchaseAmount("");
        setPurchaseDescription("");
        setSelectedCard(null);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Kat Vityèl</h2>
        
        <Dialog open={showCreateCard} onOpenChange={setShowCreateCard}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center">
              <PlusCircle className="h-4 w-4 mr-2" />
              Kreye Kat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Kreye Kat Vityèl</DialogTitle>
              <DialogDescription>
                Kreye yon kat vityèl pou achte anliyn oswa itilize fizikman.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="initial-balance">Balans Inisyal</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70">$</span>
                  <Input 
                    id="initial-balance" 
                    value={initialBalance} 
                    onChange={(e) => setInitialBalance(e.target.value)}
                    className="pl-8" 
                    placeholder="0.00"
                    type="number"
                  />
                </div>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                  Montan sa a pral dedui nan kont bankè prensipal ou.
                </p>
              </div>
              
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-md flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div className="text-sm text-yellow-700 dark:text-yellow-500">
                  <p className="font-medium">Enpòtan</p>
                  <p>Kat vityèl yo pèmèt ou fè acha anliyn san risk. Yo pa konekte dirèkteman ak kont ou.</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleGenerateCard} 
                disabled={creating || !initialBalance || parseFloat(initialBalance) <= 0}
                className="w-full"
              >
                {creating ? 'Ap kreye...' : 'Kreye Kat'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl hidden md:block" />
        </div>
      ) : cards.length === 0 ? (
        <div className="finance-card p-8 flex flex-col items-center justify-center text-center">
          <CreditCard className="h-12 w-12 text-finance-midGray mb-4" />
          <h3 className="text-lg font-bold mb-2">Pa gen kat vityèl</h3>
          <p className="text-finance-charcoal/70 dark:text-white/70 mb-6 max-w-md">
            Kat vityèl yo bay ou yon fason sekirize pou depanse lajan sou entènèt oswa nan aplikasyon mobil.
          </p>
          <Button onClick={() => setShowCreateCard(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Kreye Premye Kat Ou
          </Button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {cards.map(card => (
              <VirtualCard key={card.id} card={card} />
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="finance-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <ShoppingCart className="h-5 w-5 text-finance-blue" />
                <h3 className="text-lg font-bold">Achte ak Kat Vityèl</h3>
              </div>
              <p className="text-finance-charcoal/70 dark:text-white/70 mb-6">
                Chwazi youn nan kat vityèl ou yo pou simile yon tranzaksyon sou entènèt.
              </p>
              
              <Button 
                onClick={() => {
                  if (cards.length > 0) {
                    setSelectedCard(cards.find(card => card.is_active) || cards[0]);
                    setShowPurchase(true);
                  }
                }}
                disabled={!cards.some(card => card.is_active)}
                className="w-full"
              >
                Simile Acha
              </Button>
            </div>
            
            <div className="finance-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-5 w-5 text-finance-blue" />
                <h3 className="text-lg font-bold">Sekirite Kat</h3>
              </div>
              <ul className="space-y-3 text-finance-charcoal/70 dark:text-white/70 mb-6">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Ou kapab dezaktive kat la nenpòt kilè.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Kat la gen yon balans limite pou pwoteje w.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Tout tranzaksyon yo surveye an tan reyèl.</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full">
                Aprann Plis
              </Button>
            </div>
          </div>
        </>
      )}
      
      {/* Purchase Simulation Dialog */}
      <Dialog open={showPurchase} onOpenChange={setShowPurchase}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Simile Acha Anliyn</DialogTitle>
            <DialogDescription>
              Simile yon acha anliyn ak kat vityèl ou.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedCard && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-md">
                <p className="font-medium text-sm">Kat: **** **** **** {selectedCard.card_number.slice(-4)}</p>
                <p className="text-xs text-finance-charcoal/70 dark:text-white/70">
                  Balans disponib: ${selectedCard.balance.toFixed(2)}
                </p>
              </div>
            )}
            
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
              <Label htmlFor="purchase-description">Deskripsyon Machann</Label>
              <Input 
                id="purchase-description" 
                value={purchaseDescription} 
                onChange={(e) => setPurchaseDescription(e.target.value)}
                placeholder="Eg. Amazon.com"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleSimulatePurchase} 
              disabled={
                processing || 
                !selectedCard || 
                !purchaseAmount || 
                parseFloat(purchaseAmount) <= 0 || 
                !purchaseDescription
              }
              className="w-full"
            >
              {processing ? 'Ap trete...' : 'Simile Peman'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
