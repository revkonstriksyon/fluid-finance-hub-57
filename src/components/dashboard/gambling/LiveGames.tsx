
import { Button } from "@/components/ui/button";
import { ChevronRight, DollarSign, Users } from "lucide-react";
import { LiveGame } from "./gameData";

interface LiveGamesProps {
  games: LiveGame[];
  onJoinGame: (gameId: number) => void;
}

const LiveGames = ({ games, onJoinGame }: LiveGamesProps) => {
  return (
    <div className="mt-6">
      <h3 className="section-title mb-4">Jwèt An Dirèk</h3>
      
      <div className="space-y-3">
        {games.map(game => (
          <div key={game.id} className="border border-finance-midGray/30 dark:border-white/10 rounded-lg p-4 hover:bg-finance-lightGray/50 dark:hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{game.name}</h4>
                <div className="flex items-center mt-1">
                  <Users className="h-3 w-3 mr-1 text-finance-charcoal/70 dark:text-white/70" />
                  <span className="text-xs text-finance-charcoal/70 dark:text-white/70">
                    {game.players} jwè
                  </span>
                  <div className="mx-2 h-1 w-1 rounded-full bg-finance-charcoal/30 dark:bg-white/30"></div>
                  <DollarSign className="h-3 w-3 mr-1 text-finance-charcoal/70 dark:text-white/70" />
                  <span className="text-xs text-finance-charcoal/70 dark:text-white/70">
                    Min ${game.minBuy}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-3 text-right">
                  <div className={`text-xs font-medium mb-1 ${
                    game.status === 'In Progress' 
                      ? 'text-finance-success' 
                      : 'text-finance-gold'
                  }`}>
                    {game.status}
                  </div>
                  <div className="text-xs text-finance-charcoal/70 dark:text-white/70">
                    {game.timeLeft} rete
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onJoinGame(game.id)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveGames;
