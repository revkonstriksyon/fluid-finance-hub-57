
import { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { marketNewsData, marketIndicesData } from './tradingData';

const MarketAnalysis = () => {
  const [chartType, setChartType] = useState("area");
  const [timeRange, setTimeRange] = useState("1M");
  const [selectedIndicator, setSelectedIndicator] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample chart data
  const chartData = [
    { date: "2023-07-01", price: 175.34, volume: 120000, ma20: 173.25, ma50: 170.15, rsi: 62 },
    { date: "2023-07-02", price: 176.57, volume: 115000, ma20: 173.45, ma50: 170.25, rsi: 65 },
    { date: "2023-07-03", price: 177.82, volume: 125000, ma20: 173.85, ma50: 170.45, rsi: 68 },
    { date: "2023-07-04", price: 178.36, volume: 110000, ma20: 174.15, ma50: 170.75, rsi: 70 },
    { date: "2023-07-05", price: 179.64, volume: 130000, ma20: 174.65, ma50: 171.05, rsi: 72 },
    { date: "2023-07-06", price: 180.95, volume: 140000, ma20: 175.15, ma50: 171.35, rsi: 75 },
    { date: "2023-07-07", price: 179.78, volume: 135000, ma20: 175.55, ma50: 171.65, rsi: 71 },
    { date: "2023-07-08", price: 177.45, volume: 125000, ma20: 175.85, ma50: 171.95, rsi: 68 },
    { date: "2023-07-09", price: 178.23, volume: 118000, ma20: 176.05, ma50: 172.25, rsi: 65 },
    { date: "2023-07-10", price: 180.10, volume: 122000, ma20: 176.35, ma50: 172.55, rsi: 67 },
    { date: "2023-07-11", price: 182.36, volume: 140000, ma20: 176.85, ma50: 172.85, rsi: 70 },
    { date: "2023-07-12", price: 183.45, volume: 145000, ma20: 177.25, ma50: 173.15, rsi: 73 },
    { date: "2023-07-13", price: 184.78, volume: 150000, ma20: 177.75, ma50: 173.45, rsi: 76 },
    { date: "2023-07-14", price: 182.59, volume: 138000, ma20: 178.15, ma50: 173.75, rsi: 73 },
    { date: "2023-07-15", price: 183.67, volume: 130000, ma20: 178.55, ma50: 174.05, rsi: 74 },
  ];
  
  // Filter news based on search
  const filteredNews = searchQuery 
    ? marketNewsData.filter(news => 
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        news.relatedSymbols.some(symbol => symbol.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : marketNewsData;
  
  // Technical indicators description
  const indicators = [
    { id: "none", name: "Okenn", description: "Grafik pri de baz san okenn endikatè teknik." },
    { id: "ma", name: "Mwayèn Mobile", description: "Montre tandans pri sou yon peryòd tan espesifik (20 ak 50 jou)." },
    { id: "rsi", name: "RSI (Relative Strength Index)", description: "Mezire vitès ak chanjman mouvman pri pou idantifye kondisyon sipò-achte oswa sipò-vann." },
    { id: "macd", name: "MACD", description: "Montre relasyon ant de mwayèn mobil pri, itilize pou jwenn tandans ak chanjman momantòm." },
    { id: "bollinger", name: "Bollinger Bands", description: "Montre volatilite pri ak nivo potansyèl sipò/rezistans." },
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>AAPL - Apple Inc.</CardTitle>
                  <CardDescription>NASDAQ: AAPL - USD</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold">$183.67</div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+1.08 (+0.59%)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant={timeRange === "1D" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("1D")}
                >
                  1D
                </Button>
                <Button
                  variant={timeRange === "1W" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("1W")}
                >
                  1S
                </Button>
                <Button
                  variant={timeRange === "1M" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("1M")}
                >
                  1M
                </Button>
                <Button
                  variant={timeRange === "3M" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("3M")}
                >
                  3M
                </Button>
                <Button
                  variant={timeRange === "6M" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("6M")}
                >
                  6M
                </Button>
                <Button
                  variant={timeRange === "1Y" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("1Y")}
                >
                  1A
                </Button>
                <Button
                  variant={timeRange === "5Y" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("5Y")}
                >
                  5A
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant={chartType === "area" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("area")}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Area
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("line")}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Line
                </Button>
                <Button
                  variant={chartType === "candlestick" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("candlestick")}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Candlestick
                </Button>
                <select 
                  className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                  value={selectedIndicator}
                  onChange={(e) => setSelectedIndicator(e.target.value)}
                >
                  {indicators.map(indicator => (
                    <option key={indicator.id} value={indicator.id}>
                      {indicator.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "area" && (
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4285F4" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                        </linearGradient>
                        {selectedIndicator === "ma" && (
                          <>
                            <linearGradient id="colorMA20" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#34A853" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#34A853" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorMA50" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FBBC05" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#FBBC05" stopOpacity={0} />
                            </linearGradient>
                          </>
                        )}
                      </defs>
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} domain={['dataMin', 'dataMax']} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <RechartsTooltip />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#4285F4"
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        name="Pri"
                      />
                      {selectedIndicator === "ma" && (
                        <>
                          <Area
                            type="monotone"
                            dataKey="ma20"
                            stroke="#34A853"
                            fill="none"
                            name="MA 20"
                          />
                          <Area
                            type="monotone"
                            dataKey="ma50"
                            stroke="#FBBC05"
                            fill="none"
                            name="MA 50"
                          />
                        </>
                      )}
                      {selectedIndicator === "rsi" && (
                        <Area
                          type="monotone"
                          dataKey="rsi"
                          stroke="#EA4335"
                          fill="none"
                          name="RSI"
                          yAxisId={1}
                        />
                      )}
                      <Legend />
                    </AreaChart>
                  )}
                  
                  {chartType === "line" && (
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} domain={['dataMin', 'dataMax']} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#4285F4"
                        name="Pri"
                        dot={false}
                      />
                      {selectedIndicator === "ma" && (
                        <>
                          <Line
                            type="monotone"
                            dataKey="ma20"
                            stroke="#34A853"
                            name="MA 20"
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="ma50"
                            stroke="#FBBC05"
                            name="MA 50"
                            dot={false}
                          />
                        </>
                      )}
                      {selectedIndicator === "rsi" && (
                        <Line
                          type="monotone"
                          dataKey="rsi"
                          stroke="#EA4335"
                          name="RSI"
                          yAxisId={1}
                          dot={false}
                        />
                      )}
                      <Legend />
                    </LineChart>
                  )}
                  
                  {chartType === "candlestick" && (
                    <RechartsBarChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <RechartsTooltip />
                      <Bar dataKey="price" fill="#4285F4" name="Pri" />
                      <Bar dataKey="volume" fill="#FBBC05" name="Volim" />
                      <Legend />
                    </RechartsBarChart>
                  )}
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                {selectedIndicator !== "none" && (
                  <div className="bg-muted p-3 rounded-md">
                    <h4 className="font-medium mb-1">
                      {indicators.find(i => i.id === selectedIndicator)?.name}
                    </h4>
                    <p>{indicators.find(i => i.id === selectedIndicator)?.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Done Fondamantal</CardTitle>
              <CardDescription>Enfòmasyon finansye kle Apple Inc.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Kapitalizasyon Mache</div>
                  <div className="font-medium">$2.87T</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">P/E Ratio</div>
                  <div className="font-medium">31.52</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Dividend Yield</div>
                  <div className="font-medium">0.51%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">52-Week Range</div>
                  <div className="font-medium">$138.62 - $198.23</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">EPS</div>
                  <div className="font-medium">$5.83</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Beta</div>
                  <div className="font-medium">1.27</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Volume Mwayèn (3m)</div>
                  <div className="font-medium">56.3M</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Volim Jodi a</div>
                  <div className="font-medium">42.8M</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Endèks Mache</CardTitle>
              <CardDescription>Done ki ajou an tan reyèl</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketIndicesData.map((index) => (
                  <div key={index.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{index.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{index.value.toLocaleString()}</div>
                      <div className={`text-xs flex items-center justify-end ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {index.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        <span>
                          {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Nouvèl Mache</span>
                <div className="relative w-48">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Chèche nouvèl..."
                    className="h-9 pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNews.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Pa gen nouvèl ki matche rechèch ou a.</p>
                  </div>
                ) : (
                  filteredNews.map((news) => (
                    <div key={news.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <a href={news.url} className="font-medium hover:text-blue-600">{news.title}</a>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{news.source}</span>
                        <span>{news.time}</span>
                      </div>
                      <p className="text-sm mt-2">{news.summary}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {news.relatedSymbols.map((symbol) => (
                          <span 
                            key={symbol} 
                            className="bg-muted px-2 py-0.5 rounded-full text-xs"
                          >
                            {symbol}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;
