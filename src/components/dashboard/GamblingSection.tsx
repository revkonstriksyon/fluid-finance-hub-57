
import { Dice1, Trophy, Users, DollarSign, Clock, ChevronRight, Gamepad2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const GamblingSection = () => {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<number>(5);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Sample game data
  const featuredGames = [
    { 
      id: 1, 
      name: "Lucky Spins", 
      type: "Slot Machine", 
      minBet: 5, 
      icon: Dice1, 
      bgColor: "bg-gradient-to-br from-purple-600 to-blue-500", 
      players: 245,
      maxWin: 100
    },
    { 
      id: 2, 
      name: "Blackjack Pro", 
      type: "Card Game", 
      minBet: 10, 
      icon: Dice1, 
      bgColor: "bg-gradient-to-br from-green-600 to-teal-500", 
      players: 189,
      maxWin: 500
    },
    { 
      id: 3, 
      name: "Crypto Dice", 
      type: "Dice Game", 
      minBet: 2, 
      icon: Dice1, 
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-500", 
      players: 312,
      maxWin: 200
    },
  ];
  
  const upcomingEvents = [
    { 
      id: 1, 
      name: "NBA Finals", 
      time: "Jodi a, 8:00 PM", 
      type: "Sport", 
      teams: "Team A vs Team B",
      odds: { teamA: 1.75, teamB: 2.15 }
    },
    { 
      id: 2, 
      name: "CS:GO Tournament", 
      time: "Demen, 2:00 PM", 
      type: "E-Sport", 
      teams: "Team X vs Team Y",
      odds: { teamA: 1.95, teamB: 1.85 }
    },
    { 
      id: 3, 
      name: "Football Match", 
      time: "23 Jen, 6:30 PM", 
      type: "Sport", 
      teams: "Country A vs Country B",
      odds: { teamA: 2.50, teamB: 1.50 }
    },
  ];

  const liveGames = [
    {
      id: 1,
      name: "Poker Toune",
      players: 8,
      minBuy: 50,
      status: "In Progress",
      timeLeft: "45 min"
    },
    {
      id: 2,
      name: "Domino Match",
      players: 4,
      minBuy: 20,
      status: "Starting Soon",
      timeLeft: "5 min"
    }
  ];

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

  return (
    <div className="space-y-6 animate-fade-in">
      {selectedGame === null ? (
        <div className="finance-card">
          <h3 className="section-title mb-6">Jwèt Popilè</h3>
          
          <div className="grid md:grid-cols-3 gap-5">
            {featuredGames.map(game => (
              <div 
                key={game.id} 
                className={`${game.bgColor} rounded-xl p-5 text-white hover:scale-105 transition-transform cursor-pointer`}
                onClick={() => handleGameSelect(game.id)}
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
                  Jwe Kounye a
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="finance-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="section-title mb-0">
              {featuredGames.find(g => g.id === selectedGame)?.name}
            </h3>
            <Button variant="ghost" onClick={() => setSelectedGame(null)}>
              Retounen
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`${featuredGames.find(g => g.id === selectedGame)?.bgColor} rounded-xl p-6 text-white flex flex-col justify-between`}>
              <div>
                <div className="flex justify-between items-start mb-6">
                  {featuredGames.find(g => g.id === selectedGame)?.icon && (
                    <featuredGames.find(g => g.id === selectedGame)!.icon className="h-10 w-10 text-white/90" />
                  )}
                  <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium text-white">
                    <Users className="h-3 w-3 inline mr-1" />
                    {featuredGames.find(g => g.id === selectedGame)?.players} jwè
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
                        onClick={() => setGameResult(null)} 
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
                          Min: ${featuredGames.find(g => g.id === selectedGame)?.minBet} | 
                          Max: $100
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between space-x-4">
                        <Button 
                          onClick={handleDecreaseBet} 
                          className="bg-white/20 hover:bg-white/30 text-white h-10 w-10 p-0 rounded-full"
                        >
                          -
                        </Button>
                        <span className="text-2xl font-bold">${betAmount}</span>
                        <Button 
                          onClick={handleIncreaseBet} 
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
                  onClick={startGame}
                >
                  <Gamepad2 className="h-5 w-5 mr-2" />
                  Kòmanse Jwèt
                </Button>
              )}
            </div>
            
            <div className="bg-finance-lightGray/50 dark:bg-white/5 rounded-xl p-6">
              <h4 className="text-xl font-bold mb-4">Enfòmasyon Jwèt</h4>
              
              <div className="space-y-4">
                <div className="border-b border-finance-midGray/30 dark:border-white/10 pb-4">
                  <h5 className="font-medium mb-1">Deskripsyon</h5>
                  <p className="text-finance-charcoal/70 dark:text-white/70 text-sm">
                    {selectedGame === 1 && "Jwè yon machine a sous ak twa kolonn pou genyen gwo pri."}
                    {selectedGame === 2 && "Jwe Blackjack kont kroupye a. Rive nan 21 pou genyen."}
                    {selectedGame === 3 && "Lanse de ak chans ou. Prevwa ki nimewo k ap sòti."}
                  </p>
                </div>
                
                <div className="border-b border-finance-midGray/30 dark:border-white/10 pb-4">
                  <h5 className="font-medium mb-1">Règ Jwèt</h5>
                  <ul className="list-disc pl-5 text-finance-charcoal/70 dark:text-white/70 text-sm space-y-1">
                    {selectedGame === 1 && (
                      <>
                        <li>Peze bouton pou jwe</li>
                        <li>3 menm senbòl = gwo pri</li>
                        <li>2 menm senbòl = ti pri</li>
                      </>
                    )}
                    {selectedGame === 2 && (
                      <>
                        <li>Pi pre 21 san depase</li>
                        <li>As = 1 oswa 11</li>
                        <li>Kat figè = 10 pwen</li>
                      </>
                    )}
                    {selectedGame === 3 && (
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
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="finance-card">
          <h3 className="section-title mb-6">Evènman kap vini</h3>
          
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="border border-finance-midGray/30 dark:border-white/10 rounded-lg p-4 hover:bg-finance-lightGray/50 dark:hover:bg-white/5 transition-colors">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{event.name}</h4>
                  <span className="text-xs font-medium bg-finance-blue/10 text-finance-blue dark:bg-finance-blue/20 dark:text-finance-lightBlue px-2 py-1 rounded-full">
                    {event.type}
                  </span>
                </div>
                
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-3">
                  {event.teams}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center text-sm text-finance-charcoal/70 dark:text-white/70">
                    <Clock className="h-4 w-4 mr-1" />
                    {event.time}
                  </div>
                </div>
                
                <div className="flex justify-between space-x-4 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => placeBet(event.id, 'teamA')}
                  >
                    Ekip A ({event.odds.teamA}x)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => placeBet(event.id, 'teamB')}
                  >
                    Ekip B ({event.odds.teamB}x)
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="section-title mb-4">Jwèt An Dirèk</h3>
            
            <div className="space-y-3">
              {liveGames.map(game => (
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
                        onClick={() => joinLiveGame(game.id)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="finance-card">
          <h3 className="section-title mb-6">Match Ant Zanmi</h3>
          
          <div className="flex flex-col items-center justify-center h-[calc(100%-3rem)] border-2 border-dashed border-finance-midGray/30 dark:border-white/10 rounded-lg p-6">
            <Users className="h-12 w-12 text-finance-charcoal/30 dark:text-white/30 mb-4" />
            <h4 className="text-lg font-medium mb-2">Kreye Match Prive</h4>
            <p className="text-center text-finance-charcoal/70 dark:text-white/70 mb-4">
              Envite zanmi yo pou jwe ak parye nan yon match prive
            </p>
            <Button onClick={createPrivateMatch}>
              <Trophy className="h-4 w-4 mr-2" />
              Kreye Match
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamblingSection;
