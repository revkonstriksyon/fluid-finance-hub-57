
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyConversationViewProps {
  onNewConversation: () => void;
}

export const EmptyConversationView = ({ onNewConversation }: EmptyConversationViewProps) => {
  return (
    <div className="md:col-span-2 finance-card overflow-hidden flex flex-col">
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Pa gen konvèsasyon ki seleksyone</h3>
          <p className="text-finance-charcoal/70 dark:text-white/70 mb-4">
            Chwazi yon konvèsasyon oswa kòmanse yon nouvo konvèsasyon
          </p>
          <Button onClick={onNewConversation}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvo Mesaj
          </Button>
        </div>
      </div>
    </div>
  );
};
