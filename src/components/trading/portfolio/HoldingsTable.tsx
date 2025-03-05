
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { holdingsData } from '../tradingData';

const HoldingsTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksyon ak Pozisyon</CardTitle>
        <CardDescription>Detay chak pozisyon nan pòtfolyo a</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-7 bg-muted p-3 text-sm font-medium">
            <div className="col-span-2">Aksyon</div>
            <div className="text-right">Kantite</div>
            <div className="text-right">Pri Aktyèl</div>
            <div className="text-right">Valè Total</div>
            <div className="text-right">Pwofi/Pèt</div>
            <div className="text-right">% Chanjman</div>
          </div>
          
          <div className="divide-y">
            {holdingsData.map((holding) => (
              <div key={holding.id} className="grid grid-cols-7 p-3 text-sm">
                <div className="col-span-2">
                  <div className="font-medium">{holding.symbol}</div>
                  <div className="text-xs text-muted-foreground">{holding.name}</div>
                </div>
                <div className="text-right">{holding.shares}</div>
                <div className="text-right">${holding.currentPrice.toFixed(2)}</div>
                <div className="text-right">${holding.totalValue.toFixed(2)}</div>
                <div className={`text-right ${holding.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${holding.gain.toFixed(2)}
                </div>
                <div className={`text-right ${holding.gainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {holding.gainPercent >= 0 ? '+' : ''}{holding.gainPercent.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HoldingsTable;
