
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { VirtualCard as VirtualCardComponent } from './VirtualCard';
import { PlusCircle } from 'lucide-react';
import { useVirtualCard } from '@/hooks/useVirtualCard';

export const VirtualCardsSection = () => {
  const { 
    cards, 
    loading, 
    processingCreate,
    createVirtualCard,
    topUpVirtualCard,
    deactivateVirtualCard
  } = useVirtualCard();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCard = async () => {
    await createVirtualCard(1000); // Default initial balance
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Kat Virtual</h3>
        <Button onClick={handleCreateCard} disabled={isCreating || loading || processingCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Kreye Kat
        </Button>
      </div>
      
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, index) => (
            <Card key={index} className="bg-finance-lightGray/30 dark:bg-white/5 p-4">
              <Skeleton className="h-32 w-full" />
            </Card>
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-finance-charcoal/70 dark:text-white/70">Ou pa gen okenn kat virtual pou kounye a.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <VirtualCardComponent
              key={card.id}
              card={card}
              topUpVirtualCard={topUpVirtualCard}
              deactivateVirtualCard={deactivateVirtualCard}
            />
          ))}
        </div>
      )}
    </div>
  );
};
