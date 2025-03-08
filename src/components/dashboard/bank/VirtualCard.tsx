import { useState } from 'react';
import { CreditCard, Copy, Eye, EyeOff, Shield, Power, PowerOff, CreditCardIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VirtualCard as VirtualCardType } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { useVirtualCards } from '@/hooks/useVirtualCards';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VirtualCardProps {
  card: VirtualCardType;
}

export const VirtualCard = ({ card }: VirtualCardProps) => {
  const { toast } = useToast();
  const { toggleCardStatus, simulateTransaction } = useVirtualCards();
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState(0);

  // Mask the card number for display
  const maskCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
  };

  // Handle card number copy
  const copyCardNumber = () => {
    navigator.clipboard.writeText(card.card_number).then(() => {
      toast({
        title: "Kopi",
        description: "Nimewo kat la kopye nan clipboard.",
      });
    });
  };

  // Handle CVV copy
  const copyCVV = () => {
    navigator.clipboard.writeText(card.cvv).then(() => {
      toast({
        title: "Kopi",
        description: "CVV kopye nan clipboard.",
      });
    });
  };

  // Handle toggle active status
  const handleToggleStatus = async () => {
    setProcessing(true);
    try {
      const result = await toggleCardStatus(card.id, !card.is_active);
      if (result.success) {
        toast({
          title: card.is_active ? "Kat Dezaktive" : "Kat Aktive",
          description: card.is_active ? 
            "Kat la dezaktive. Ou pa kapab fè okenn tranzaksyon ak li." : 
            "Kat la aktive. Ou kapab fè tranzaksyon ak li kounye a.",
        });
      }
    } finally {
      setProcessing(false);
    }
  };

  // Handle a test transaction
  const initiateTestTransaction = async () => {
    if (!card.is_active) {
      toast({
        title: "Kat inaktif",
        description: "Ou pa kapab fè tranzaksyon ak yon kat ki dezaktive.",
        variant: "destructive"
      });
      return;
    }

    // Generate a random small amount for the test transaction
    const amount = Math.floor(Math.random() * 10) + 1; // $1-$10
    setTransactionAmount(amount);
    setShowConfirmDialog(true);
  };

  const confirmAndProcessTransaction = async () => {
    setProcessing(true);
    try {
      const result = await simulateTransaction(
        card.id,
        transactionAmount,
        "Test tranzaksyon"
      );
      
      if (result.success) {
        toast({
          title: "Tranzaksyon reyisi",
          description: `$${transactionAmount} retire nan kat la pou yon test tranzaksyon.`,
        });
      }
    } finally {
      setProcessing(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <div className={`relative overflow-hidden rounded-xl ${card.is_active ? 'bg-gradient-to-br from-blue-600 to-purple-700' : 'bg-gradient-to-br from-gray-600 to-gray-800'} text-white shadow-md transition-all duration-300 hover:shadow-lg dark:shadow-blue-900/20 p-6 h-56 w-full max-w-sm mx-auto`}>
        {!card.is_active && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-1 rotate-45 absolute text-xs font-bold w-48 text-center">
              DEZAKTIVE
            </div>
          </div>
        )}
        
        {/* Card header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-8 w-8" />
            <div>
              <p className="text-xs opacity-80">Kat Vityèl</p>
              <p className="font-medium">Mastercard</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={processing}
            className="h-8 w-8 text-white bg-white/10 hover:bg-white/20 hover:text-white"
            onClick={handleToggleStatus}
          >
            {card.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Card number */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <p className="font-mono text-xl tracking-widest">
              {showCardDetails ? card.card_number : maskCardNumber(card.card_number)}
            </p>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-white bg-white/10 hover:bg-white/20 hover:text-white"
              onClick={copyCardNumber}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        {/* Card details */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs opacity-80">Ekspirasyon</p>
            <p className="font-mono">{card.expiration}</p>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-xs opacity-80">CVV</p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 text-white bg-white/10 hover:bg-white/20 hover:text-white p-0.5"
                onClick={() => setShowCardDetails(!showCardDetails)}
              >
                {showCardDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <p className="font-mono">{showCardDetails ? card.cvv : '•••'}</p>
              {showCardDetails && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 text-white bg-white/10 hover:bg-white/20 hover:text-white p-0.5"
                  onClick={copyCVV}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs opacity-80">Balans</p>
            <p className="font-mono">${card.balance.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Test transaction button */}
        <Button
          variant="ghost" 
          size="sm"
          className="absolute bottom-2 left-6 text-white bg-white/10 hover:bg-white/20 hover:text-white text-xs"
          onClick={initiateTestTransaction}
          disabled={processing || !card.is_active}
        >
          Test Tranzaksyon
        </Button>
        
        {/* Card footer */}
        <div className="absolute bottom-6 right-6 flex items-center space-x-1 text-xs">
          <Shield className="h-3 w-3" />
          <span>Sekirize</span>
        </div>
      </div>

      {/* Confirmation Dialog for Test Transaction */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfime Tranzaksyon Test</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4 py-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 dark:text-gray-400">Montan:</span>
                  <span className="font-semibold">${transactionAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 dark:text-gray-400">Kat:</span>
                  <span className="font-semibold">
                    •••• •••• •••• {card.card_number.slice(-4)}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 dark:text-gray-400">Balans kouran:</span>
                  <span className="font-semibold">${card.balance.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 dark:text-gray-400">Balans apre tranzaksyon:</span>
                  <span className="font-semibold">${(card.balance - transactionAmount).toFixed(2)}</span>
                </div>
                
                <div className="p-3 mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-md flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <p className="text-sm font-medium">Konfime Tranzaksyon Test</p>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Sa a se yon tranzaksyon similasyon pou teste fonksyonnalite kat vityèl ou.
                    Èske ou konfime tranzaksyon sa a?
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anile</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAndProcessTransaction}
              disabled={processing}
            >
              {processing ? 'Ap trete...' : 'Konfime Tranzaksyon'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
