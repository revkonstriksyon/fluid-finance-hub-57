
import { useState } from "react";
import FeaturedGames from "./FeaturedGames";
import GameDetails from "./GameDetails";
import UpcomingEvents from "./UpcomingEvents";
import LiveGames from "./LiveGames";
import PrivateMatchCard from "./PrivateMatchCard";
import { useToast } from "@/hooks/use-toast";
import { gameData } from "./gameData";

const GamblingSection = () => {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<number>(5);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const { toast } = useToast();

  const { featuredGames, upcomingEvents, liveGames } = gameData;

  const handleGameSelect = (id: number) => {
    setSelectedGame(id);
    setGameResult(null);
  };

  const handleIncreaseBet = () => {
    setBetAmount(prev => prev + 5);
  };

  const handleDecreaseBet = () => {
    if (betAmount > 5) {
      setBetAmount(prev => prev - 5);
    }
  };

  const startGame = () => {
    if (!selectedGame) {
      toast({
        title: "Erè",
        description: "Tanpri chwazi yon jwèt anvan ou kòmanse",
        variant: "destructive"
      });
      return;
    }

    setGameInProgress(true);
    
    // Simulate game progress
    setTimeout(() => {
      const result = Math.random();
      let message = "";
      let variant: "default" | "destructive" = "default";
      
      if (result > 0.7) {
        const winAmount = Math.floor(betAmount * (1 + Math.random() * 3));
        message = `Ou genyen $${winAmount}!`;
        setGameResult(`Ou genyen $${winAmount}!`);
      } else {
        message = "Ou pèdi! Eseye ankò.";
        setGameResult("Ou pèdi! Eseye ankò.");
        variant = "destructive";
      }
      
      setGameInProgress(false);
      toast({
        title: "Rezilta Jwèt",
        description: message,
        variant
      });
    }, 2000);
  };

  const placeBet = (eventId: number, team: 'teamA' | 'teamB') => {
    const event = upcomingEvents.find(e => e.id === eventId);
    if (!event) return;
    
    toast({
      title: "Pari Plase",
      description: `Ou plase yon pari $${betAmount} sou ${team === 'teamA' ? 'Ekip A' : 'Ekip B'} nan ${event.name} ak yon cote ${event.odds[team]}`,
    });
  };

  const joinLiveGame = (gameId: number) => {
    const game = liveGames.find(g => g.id === gameId);
    if (!game) return;
    
    toast({
      title: "Ou rejwenn jwèt la",
      description: `Ou antre nan ${game.name}. Bon chans!`,
    });
  };

  const createPrivateMatch = () => {
    toast({
      title: "Match Prive Kreye",
      description: "Ou kreye yon match prive. Pataje lyen an ak zanmi yo pou yo ka rejwenn ou.",
    });
  };

  // Find the game object based on selectedGame ID
  const selectedGameObject = selectedGame !== null 
    ? featuredGames.find(g => g.id === selectedGame) 
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {selectedGame === null ? (
        <FeaturedGames 
          featuredGames={featuredGames}
          onGameSelect={handleGameSelect}
        />
      ) : (
        <GameDetails
          selectedGame={selectedGameObject}
          gameInProgress={gameInProgress}
          gameResult={gameResult}
          betAmount={betAmount}
          onIncreaseBet={handleIncreaseBet}
          onDecreaseBet={handleDecreaseBet}
          onStartGame={startGame}
          onResetGameResult={() => setGameResult(null)}
          onGoBack={() => setSelectedGame(null)}
        />
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="finance-card">
          <UpcomingEvents 
            events={upcomingEvents} 
            onPlaceBet={placeBet} 
          />
          <LiveGames 
            games={liveGames} 
            onJoinGame={joinLiveGame} 
          />
        </div>
        
        <PrivateMatchCard onCreateMatch={createPrivateMatch} />
      </div>
    </div>
  );
};

export default GamblingSection;
