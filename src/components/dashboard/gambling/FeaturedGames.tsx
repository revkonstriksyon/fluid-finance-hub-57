
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { FeaturedGame } from "./gameData";

interface FeaturedGamesProps {
  featuredGames: FeaturedGame[];
  onGameSelect: (id: number) => void;
}

const FeaturedGames = ({ featuredGames, onGameSelect }: FeaturedGamesProps) => {
  return (
    <div className="finance-card">
      <h3 className="section-title mb-6">Jwèt Popilè</h3>
      
      <div className="grid md:grid-cols-3 gap-5">
        {featuredGames.map(game => (
          <div 
            key={game.id} 
            className={`${game.bgColor} rounded-xl p-5 text-white hover:scale-105 transition-transform cursor-pointer`}
            onClick={() => onGameSelect(game.id)}
          >
            <div className="flex justify-between items-start mb-6">
              <game.icon className="h-8 w-8 text-white/90" />
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium text-white">
                <Users className="h-3 w-3 inline mr-1" />
                {game.players} jwè
              </div>
            </div>
            
            <h4 className="text-xl font-bold mb-1">{game.name}</h4>
            <p className="text-white/80 text-sm mb-4">{game.type}</p>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80 text-sm">Min Bet:</span>
              <span className="font-medium">${game.minBet}</span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80 text-sm">Max Win:</span>
              <span className="font-medium">${game.maxWin}</span>
            </div>
            
            <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-none">
              Jwe Kounye A
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedGames;
