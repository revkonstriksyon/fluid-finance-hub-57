
import { Dice1 } from 'lucide-react';

export interface FeaturedGame {
  id: number;
  name: string;
  type: string;
  minBet: number;
  icon: any;
  bgColor: string;
  players: number;
  maxWin: number;
}

export interface UpcomingEvent {
  id: number;
  name: string;
  time: string;
  type: string;
  teams: string;
  odds: { teamA: number; teamB: number };
}

export interface LiveGame {
  id: number;
  name: string;
  players: number;
  minBuy: number;
  status: string;
  timeLeft: string;
}

export const gameData = {
  // Sample game data
  featuredGames: [
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
  ],
  
  upcomingEvents: [
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
  ],

  liveGames: [
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
  ]
};
