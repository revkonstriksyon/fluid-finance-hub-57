
import { TrendingUp, DollarSign, PieChart } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { holdingsData } from '../tradingData';

const PortfolioSummaryCards = () => {
  // Calculate total portfolio value
  const totalPortfolioValue = holdingsData.reduce((total, holding) => total + holding.totalValue, 0);
  const cashBalance = 5845.20;
  const totalAssets = totalPortfolioValue + cashBalance;
  
  // Calculate overall gain/loss
  const totalInvestment = holdingsData.reduce((total, holding) => total + (holding.averageCost * holding.shares), 0);
  const totalGain = totalPortfolioValue - totalInvestment;
  const totalGainPercent = (totalGain / totalInvestment) * 100;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-normal flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            Valè Total Pòtfolyo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className={`flex items-center mt-1 text-xs ${totalGainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGainPercent >= 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
            )}
            <span>
              {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}% ansanm
            </span>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-muted-foreground">
            Lajan kach: ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-normal flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Pèfòmans Anyèl
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%
          </div>
          <div className={`flex items-center mt-1 text-xs ${totalGainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>
              ${totalGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-muted-foreground">
            Depi 1 an
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-normal flex items-center">
            <PieChart className="h-4 w-4 mr-1" />
            Divèsifikasyon Pòtfolyo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-lg font-medium">60% Aksyon</div>
            <Badge variant="outline">Ekilibre</Badge>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-muted-foreground">
            4 klas aktif
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PortfolioSummaryCards;
