
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  portfolioPerformanceData, 
  portfolioAllocationData, 
  holdingsData 
} from './tradingData';

const PortfolioDashboard = () => {
  // Calculate total portfolio value
  const totalPortfolioValue = holdingsData.reduce((total, holding) => total + holding.totalValue, 0);
  const cashBalance = 5845.20;
  const totalAssets = totalPortfolioValue + cashBalance;
  
  // Calculate overall gain/loss
  const totalInvestment = holdingsData.reduce((total, holding) => total + (holding.averageCost * holding.shares), 0);
  const totalGain = totalPortfolioValue - totalInvestment;
  const totalGainPercent = (totalGain / totalInvestment) * 100;
  
  // Colors for pie chart
  const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];
  
  return (
    <div className="space-y-6">
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
              <BarChart3 className="h-4 w-4 mr-1" />
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Pèfòmans Pòtfolyo</CardTitle>
              <CardDescription>Evolisyon valè pòtfolyo sou 12 mwa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={portfolioPerformanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4285F4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <RechartsTooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Valè']}
                      labelFormatter={(label) => `${label} 2023`}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#4285F4"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Alokasyon Aktif</CardTitle>
            <CardDescription>Distribisyon pòtfolyo pa klas aktif</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={portfolioAllocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {portfolioAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
      
      <Card>
        <CardHeader>
          <CardTitle>Reyisit ak Sijesyon</CardTitle>
          <CardDescription>Rekòmandasyon pou amelyore pòtfolyo ou</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Divèsifikasyon solid</h4>
                <p className="text-sm text-muted-foreground">Pòtfolyo ou gen yon bon melanj aksyon, obligasyon, ak lajan kach.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Sektè teknoloji domine</h4>
                <p className="text-sm text-muted-foreground">Konsidere ajoute aksyon nan lòt sektè tankou sante, enèji, oswa finans pou pi bon divèsifikasyon.</p>
                <div className="mt-2">
                  <div className="text-xs mb-1 flex justify-between">
                    <span>Ekspozisyon nan teknoloji</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Okenn pozisyon entènasyonal</h4>
                <p className="text-sm text-muted-foreground">Konsidere ajoute ETF entènasyonal tankou VEA oswa VXUS pou ekspozisyon global.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioDashboard;
