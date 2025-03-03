
import { Button } from "@/components/ui/button";
import { Trophy, Users } from "lucide-react";

interface PrivateMatchCardProps {
  onCreateMatch: () => void;
}

const PrivateMatchCard = ({ onCreateMatch }: PrivateMatchCardProps) => {
  return (
    <div className="finance-card">
      <h3 className="section-title mb-6">Match Ant Zanmi</h3>
      
      <div className="flex flex-col items-center justify-center h-[calc(100%-3rem)] border-2 border-dashed border-finance-midGray/30 dark:border-white/10 rounded-lg p-6">
        <Users className="h-12 w-12 text-finance-charcoal/30 dark:text-white/30 mb-4" />
        <h4 className="text-lg font-medium mb-2">Kreye Match Prive</h4>
        <p className="text-center text-finance-charcoal/70 dark:text-white/70 mb-4">
          Envite zanmi yo pou jwe ak parye nan yon match prive
        </p>
        <Button onClick={onCreateMatch}>
          <Trophy className="h-4 w-4 mr-2" />
          Kreye Match
        </Button>
      </div>
    </div>
  );
};

export default PrivateMatchCard;
