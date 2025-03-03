
import { BarChart3, Briefcase, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const TradingSection = () => {
  // Sample chart data
  const chartData = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 1398 },
    { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 3908 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 3800 },
    { name: 'Jul', value: 4300 },
  ];
  
  // Sample stock data
  const stocks = [
    { 
      id: 1, 
      symbol: "AAPL", 
      name: "Apple Inc.", 
      price: 175.34, 
      change: 2.5, 
      positive: true,
      shares: 10
    },
    { 
      id: 2, 
      symbol: "MSFT", 
      name: "Microsoft Corp.", 
      price: 310.65, 
      change: 1.2, 
      positive: true,
      shares: 5
    },
    { 
      id: 3, 
      symbol: "AMZN", 
      name: "Amazon.com Inc.", 
      price: 132.80, 
      change: -0.8, 
      positive: false,
      shares: 8
    },
    { 
      id: 4, 
      symbol: "TSLA", 
      name: "Tesla Inc.", 
      price: 265.55, 
      change: -1.4, 
      positive: false,
      shares: 3
    },
  ];
  
  // Market news
  const marketNews = [
    {
      id: 1,
      title: "Fed to raise interest rates by 0.25%",
      time: "30 min pase",
      source: "Financial Times"
    },
    {
      id: 2,
      title: "Tech stocks surge amid strong earnings",
      time: "2 èdtan pase",
      source: "Wall Street Journal"
    },
    {
      id: 3,
      title: "Oil prices fall as global demand slows",
      time: "5 èdtan pase",
      source: "Bloomberg"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="finance-card">
        <h3 className="section-title mb-6">Pòtfolyo Mwen</h3>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-finance-lightGray/50 dark:bg-white/5 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Briefcase className="h-5 w-5 text-finance-charcoal/70 dark:text-white/70 mr-2" />
              <span className="text-sm text-finance-charcoal/70 dark:text-white/70">Valè Total</span>
            </div>
            <p className="text-2xl font-bold">$5,241.82</p>
            <div className="flex items-center mt-1 text-finance-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">+3.2% semèn sa</span>
            </div>
          </div>
          
          <div className="bg-finance-lightGray/50 dark:bg-white/5 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <BarChart3 className="h-5 w-5 text-finance-charcoal/70 dark:text-white/70 mr-2" />
              <span className="text-sm text-finance-charcoal/70 dark:text-white/70">Pèfòmans</span>
            </div>
            <p className="text-2xl font-bold">+$187.45</p>
            <div className="flex items-center mt-1 text-finance-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">+8.5% Anyèl</span>
            </div>
          </div>
          
          <div className="bg-finance-lightGray/50 dark:bg-white/5 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 text-finance-charcoal/70 dark:text-white/70 mr-2" />
              <span className="text-sm text-finance-charcoal/70 dark:text-white/70">Lajan Disponib</span>
            </div>
            <p className="text-2xl font-bold">$845.20</p>
            <div className="flex items-center mt-1 text-finance-charcoal/70 dark:text-white/70">
              <span className="text-xs">Pou achte aksyon</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7FB3E1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#7FB3E1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#7FB3E1"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button>
            <TrendingUp className="h-4 w-4 mr-2" />
            Achte Aksyon
          </Button>
          <Button variant="outline">
            <TrendingDown className="h-4 w-4 mr-2" />
            Vann Aksyon
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 finance-card">
          <h3 className="section-title mb-6">Aksyon Mwen</h3>
          
          <div className="rounded-lg border border-finance-midGray/30 dark:border-white/10 overflow-hidden">
            <div className="grid grid-cols-4 bg-finance-lightGray/70 dark:bg-white/5 p-3">
              <div className="col-span-2 text-sm font-medium">Aksyon</div>
              <div className="text-right text-sm font-medium">Pri</div>
              <div className="text-right text-sm font-medium">Chanjman</div>
            </div>
            
            <div className="divide-y divide-finance-midGray/30 dark:divide-white/10">
              {stocks.map(stock => (
                <div key={stock.id} className="grid grid-cols-4 p-3 hover:bg-finance-lightGray/30 dark:hover:bg-white/5 transition-colors">
                  <div className="col-span-2">
                    <p className="font-medium">{stock.symbol}</p>
                    <div className="flex items-center">
                      <p className="text-xs text-finance-charcoal/70 dark:text-white/70">
                        {stock.name} • {stock.shares} shares
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-medium">${stock.price}</div>
                  <div className={`text-right font-medium ${stock.positive ? 'text-finance-success' : 'text-finance-danger'}`}>
                    {stock.positive ? '+' : ''}{stock.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="finance-card">
          <h3 className="section-title mb-6">Nouvèl Mache a</h3>
          
          <div className="space-y-4">
            {marketNews.map(news => (
              <div key={news.id} className="border-b border-finance-midGray/30 dark:border-white/10 pb-4 last:border-0">
                <h4 className="font-medium mb-2">{news.title}</h4>
                <div className="flex justify-between text-sm text-finance-charcoal/70 dark:text-white/70">
                  <span>{news.source}</span>
                  <span>{news.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-finance-lightGray/50 dark:bg-white/5 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-finance-warning mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
              Trading gen risk. Asire w ke ou konprann risk yo anvan ou fè tranzaksyon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSection;
