
import { Dice, Trophy, Users, DollarSign, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";

const GamblingSection = () => {
  // Sample game data
  const featuredGames = [
    { 
      id: 1, 
      name: "Lucky Spins", 
      type: "Slot Machine", 
      minBet: 5, 
      icon: Dice, 
      bgColor: "bg-gradient-to-br from-purple-600 to-blue-500", 
      players: 245
    },
    { 
      id: 2, 
      name: "Blackjack Pro", 
      type: "Card Game", 
      minBet: 10, 
      icon: Dice, 
      bgColor: "bg-gradient-to-br from-green-600 to-teal-500", 
      players: 189
    },
    { 
      id: 3, 
      name: "Crypto Dice", 
      type: "Dice Game", 
      minBet: 2, 
      icon: Dice, 
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-500", 
      players: 312
    },
  ];
  
  const upcomingEvents = [
    { 
      id: 1, 
      name: "NBA Finals", 
      time: "Jodi a, 8:00 PM", 
      type: "Sport", 
      teams: "Team A vs Team B"
    },
    { 
      id: 2, 
      name: "CS:GO Tournament", 
      time: "Demen, 2:00 PM", 
      type: "E-Sport", 
      teams: "Team X vs Team Y"
    },
    { 
      id: 3, 
      name: "Football Match", 
      time: "23 Jen, 6:30 PM", 
      type: "Sport", 
      teams: "Country A vs Country B"
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="finance-card">
        <h3 className="section-title mb-6">Jwèt Popilè</h3>
        
        <div className="grid md:grid-cols-3 gap-5">
          {featuredGames.map(game => (
            <div key={game.id} className={`${game.bgColor} rounded-xl p-5 text-white`}>
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
              
              <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-none">
                Jwe Kounye a
              </Button>
            </div>
          ))}
        </div>
      </div>
      
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
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-finance-charcoal/70 dark:text-white/70">
                    <Clock className="h-4 w-4 mr-1" />
                    {event.time}
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Parye
                  </Button>
                </div>
              </div>
            ))}
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
            <Button>
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
