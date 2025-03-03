
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gamepad2, Users } from "lucide-react";
import { FeaturedGame } from "./gameData";

interface GameDetailsProps {
  selectedGame: FeaturedGame | null;
  gameInProgress: boolean;
  gameResult: string | null;
  betAmount: number;
  onIncreaseBet: () => void;
  onDecreaseBet: () => void;
  onStartGame: () => void;
  onResetGameResult: () => void;
  onGoBack: () => void;
}

const GameDetails = ({ 
  selectedGame, 
  gameInProgress, 
  gameResult, 
  betAmount, 
  onIncreaseBet, 
  onDecreaseBet, 
  onStartGame, 
  onResetGameResult,
  onGoBack 
}: GameDetailsProps) => {
  if (!selectedGame) return null;

  return (
    <div className="finance-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="section-title mb-0">
          {selectedGame.name}
        </h3>
        <Button variant="ghost" onClick={onGoBack}>
          Retounen
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`${selectedGame.bgColor} rounded-xl p-6 text-white flex flex-col justify-between`}>
          <div>
            <div className="flex justify-between items-start mb-6">
              {selectedGame.icon && (
                <selectedGame.icon className="h-10 w-10 text-white/90" />
              )}
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium text-white">
                <Users className="h-3 w-3 inline mr-1" />
                {selectedGame.players} jwè
              </div>
            </div>
            
            <div className="mb-6">
              {gameInProgress ? (
                <div className="space-y-4">
                  <p className="text-center text-lg font-medium">Jwèt an kou...</p>
                  <Progress value={100} className="h-2 animate-progress bg-white/20" />
                </div>
              ) : gameResult ? (
                <div className="text-center py-4">
                  <p className="text-xl font-bold mb-2">{gameResult}</p>
                  <Button 
                    onClick={onResetGameResult} 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/20"
                  >
                    Jwe Ankò
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-xl font-bold mb-2">Mete Bet Ou</h4>
                    <p className="text-white/80 text-sm">
                      Min: ${selectedGame.minBet} | 
                      Max: $100
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-4">
                    <Button 
                      onClick={onDecreaseBet} 
                      className="bg-white/20 hover:bg-white/30 text-white h-10 w-10 p-0 rounded-full"
                    >
                      -
                    </Button>
                    <span className="text-2xl font-bold">${betAmount}</span>
                    <Button 
                      onClick={onIncreaseBet} 
                      className="bg-white/20 hover:bg-white/30 text-white h-10 w-10 p-0 rounded-full"
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {!gameInProgress && !gameResult && (
            <Button 
              className="w-full bg-white/20 hover:bg-white/30 text-white border-none text-lg py-6"
              onClick={onStartGame}
            >
              <Gamepad2 className="h-5 w-5 mr-2" />
              Kòmanse Jwèt
            </Button>
          )}
        </div>
        
        <GameInfo selectedGameId={selectedGame.id} />
      </div>
    </div>
  );
};

const GameInfo = ({ selectedGameId }: { selectedGameId: number }) => {
  return (
    <div className="bg-finance-lightGray/50 dark:bg-white/5 rounded-xl p-6">
      <h4 className="text-xl font-bold mb-4">Enfòmasyon Jwèt</h4>
      
      <div className="space-y-4">
        <div className="border-b border-finance-midGray/30 dark:border-white/10 pb-4">
          <h5 className="font-medium mb-1">Deskripsyon</h5>
          <p className="text-finance-charcoal/70 dark:text-white/70 text-sm">
            {selectedGameId === 1 && "Jwè yon machine a sous ak twa kolonn pou genyen gwo pri."}
            {selectedGameId === 2 && "Jwe Blackjack kont kroupye a. Rive nan 21 pou genyen."}
            {selectedGameId === 3 && "Lanse de ak chans ou. Prevwa ki nimewo k ap sòti."}
          </p>
        </div>
        
        <div className="border-b border-finance-midGray/30 dark:border-white/10 pb-4">
          <h5 className="font-medium mb-1">Règ Jwèt</h5>
          <ul className="list-disc pl-5 text-finance-charcoal/70 dark:text-white/70 text-sm space-y-1">
            {selectedGameId === 1 && (
              <>
                <li>Peze bouton pou jwe</li>
                <li>3 menm senbòl = gwo pri</li>
                <li>2 menm senbòl = ti pri</li>
              </>
            )}
            {selectedGameId === 2 && (
              <>
                <li>Pi pre 21 san depase</li>
                <li>As = 1 oswa 11</li>
                <li>Kat figè = 10 pwen</li>
              </>
            )}
            {selectedGameId === 3 && (
              <>
                <li>Prevwa si rezilta a pral wo oswa ba</li>
                <li>7 oswa plis = wo</li>
                <li>6 oswa mwens = ba</li>
              </>
            )}
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium mb-1">Istwa Jwèt Ou</h5>
          <p className="text-finance-charcoal/70 dark:text-white/70 text-sm italic">
            Ou poko jwe okenn jwèt nan seksyon sa a.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
