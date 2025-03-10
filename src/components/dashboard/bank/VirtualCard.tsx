import { useState } from 'react';
import { MoreVertical, Edit, Trash, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { TopUpVirtualCardDialog } from './dialogs/TopUpVirtualCardDialog';

interface VirtualCardProps {
  card: {
    id: string;
    card_number: string;
    expiration: string;
    cvv: string;
    balance: number;
    is_active: boolean;
    created_at: string;
  };
  topUpVirtualCard: (cardId: string, amount: number, sourceAccountId: string) => Promise<void>;
  deactivateVirtualCard: (cardId: string) => Promise<void>;
  accounts: any[];
}

export const VirtualCard = ({ card, topUpVirtualCard, deactivateVirtualCard, accounts }: VirtualCardProps) => {
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);

  const handleCardAction = async () => {
    if (card.is_active) {
      await deactivateVirtualCard(card.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 relative">
      {/* Card Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Virtual Card <Badge variant="secondary">{card.is_active ? "Active" : "Inactive"}</Badge>
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsTopUpDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Top Up
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCardAction} disabled={!card.is_active}>
              {card.is_active ? (
                <>
                  <XCircle className="mr-2 h-4 w-4 text-red-500" /> Deactivate
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash className="mr-2 h-4 w-4 text-red-500" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Card Details */}
      <div className="space-y-2">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Card Number</span>
          <p className="font-medium text-gray-900 dark:text-gray-50">{card.card_number}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Expiration</span>
          <p className="font-medium text-gray-900 dark:text-gray-50">{card.expiration}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">CVV</span>
          <p className="font-medium text-gray-900 dark:text-gray-50">{card.cvv}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Balance</span>
          <p className="font-bold text-gray-900 dark:text-gray-50">${card.balance}</p>
        </div>
      </div>

      {/* Alert if Inactive */}
      {!card.is_active && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 bg-opacity-50 rounded-lg">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-6 w-6 text-yellow-500 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300">This card is inactive.</p>
          </div>
        </div>
      )}
      
      <TopUpVirtualCardDialog
        isOpen={isTopUpDialogOpen}
        onOpenChange={setIsTopUpDialogOpen}
        cardId={card.id}
        topUpVirtualCard={topUpVirtualCard}
        accounts={accounts}
      />
    </div>
  );
};
