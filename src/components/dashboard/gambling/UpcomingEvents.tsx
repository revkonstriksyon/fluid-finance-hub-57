
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { UpcomingEvent } from "./gameData";

interface UpcomingEventsProps {
  events: UpcomingEvent[];
  onPlaceBet: (eventId: number, team: 'teamA' | 'teamB') => void;
}

const UpcomingEvents = ({ events, onPlaceBet }: UpcomingEventsProps) => {
  return (
    <>
      <h3 className="section-title mb-6">Evènman kap vini</h3>
      
      <div className="space-y-4">
        {events.map(event => (
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
                onClick={() => onPlaceBet(event.id, 'teamA')}
              >
                Ekip A ({event.odds.teamA}x)
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onPlaceBet(event.id, 'teamB')}
              >
                Ekip B ({event.odds.teamB}x)
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UpcomingEvents;
