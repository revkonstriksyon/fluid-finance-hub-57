
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, Info, Share2 } from 'lucide-react';

// Temporary data - would be imported from an API
const marketData = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 50245.32,
    change: 2.4,
    volume: '32.5B',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2845.21,
    change: -1.2, 
    volume: '18.7B',
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    price: 0.5821,
    change: 5.7,
    volume: '4.2B', 
  },
  {
    symbol: 'HTG',
    name: 'Haitian Gourde',
    price: 0.0078,
    change: 0.3,
    volume: '124.5M',
  },
];

const newsData = [
  {
    title: 'Bitcoin Breaks $50K for First Time in 2 Years',
    source: 'CryptoNews',
    time: '2h ago',
    url: '#',
  },
  {
    title: 'Central Bank of Haiti Considers Digital Currency',
    source: 'Haiti Financial Times',
    time: '5h ago',
    url: '#',
  },
  {
    title: 'New Regulations for Crypto Trading in Caribbean',
    source: 'Caribbean Finance',
    time: '1d ago',
    url: '#',
  },
];

const analystRatings = [
  {
    symbol: 'BTC',
    buy: 75,
    hold: 20,
    sell: 5,
  },
  {
    symbol: 'ETH',
    buy: 65,
    hold: 30,
    sell: 5,
  },
  {
    symbol: 'XRP',
    buy: 40,
    hold: 45,
    sell: 15,
  },
];

const MarketAnalysis = () => {
  const [activeTab, setActiveTab] = useState('markets');

  return (
    <Card className="border-finance-midGray/30 shadow-sm h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Market Analysis</CardTitle>
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Latest market data and analysis
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="px-2 py-2 overflow-auto">
          <TabsContent value="markets" className="m-0">
            <div className="space-y-1 px-4">
              {marketData.map((coin) => (
                <div key={coin.symbol} className="flex items-center justify-between py-3 border-b border-finance-midGray/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-finance-blue/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-finance-blue">{coin.symbol}</span>
                    </div>
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-xs text-muted-foreground">Vol: {coin.volume}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${coin.price.toLocaleString()}</div>
                    <div className="flex items-center">
                      {coin.change > 0 ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          {coin.change}%
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          {Math.abs(coin.change)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="news" className="m-0">
            <div className="space-y-1 px-4">
              {newsData.map((item, i) => (
                <div key={i} className="py-3 border-b border-finance-midGray/10">
                  <div className="font-medium">{item.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-muted-foreground">
                      {item.source} • {item.time}
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="m-0">
            <div className="space-y-4 px-4">
              {analystRatings.map((rating) => (
                <div key={rating.symbol} className="py-3 border-b border-finance-midGray/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{rating.symbol} Analyst Consensus</div>
                    <div className="text-sm font-semibold text-green-500">{rating.buy}% Buy</div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${rating.buy}%` }}
                    />
                    <div 
                      className="h-full bg-yellow-500"
                      style={{ width: `${rating.hold}%` }}
                    />
                    <div 
                      className="h-full bg-red-500"
                      style={{ width: `${rating.sell}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Buy: {rating.buy}%</span>
                    <span>Hold: {rating.hold}%</span>
                    <span>Sell: {rating.sell}%</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="pt-1 pb-4 px-6">
          <Button variant="outline" size="sm" className="w-full">
            View Full Market Report
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default MarketAnalysis;
