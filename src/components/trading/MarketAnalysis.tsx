
import { useState } from 'react';
import { Search, TrendingUp, Filter, ArrowUp, ArrowDown, Newspaper, BarChart3, Activity } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const MarketAnalysis = () => {
  const [selectedTab, setSelectedTab] = useState("charts");
  const [timeRange, setTimeRange] = useState("1d");
  const [chartType, setChartType] = useState("area");
  
  // Sample stock data for chart
  const stockData = [
    { date: "9:30", price: 152.34, volume: 1200 },
    { date: "10:00", price: 153.21, volume: 1500 },
    { date: "10:30", price: 152.85, volume: 1100 },
    { date: "11:00", price: 153.45, volume: 1800 },
    { date: "11:30", price: 154.12, volume: 2200 },
    { date: "12:00", price: 153.89, volume: 1600 },
    { date: "12:30", price: 154.23, volume: 1400 },
    { date: "13:00", price: 155.01, volume: 2500 },
    { date: "13:30", price: 154.87, volume: 1700 },
    { date: "14:00", price: 155.43, volume: 2100 },
    { date: "14:30", price: 156.21, volume: 2800 },
    { date: "15:00", price: 155.98, volume: 2300 },
    { date: "15:30", price: 156.34, volume: 2600 },
    { date: "16:00", price: 157.02, volume: 3200 },
  ];
  
  // Sample market sentiment data
  const sentimentData = [
    { name: "Pozitif", value: 55 },
    { name: "Nèt", value: 30 },
    { name: "Negatif", value: 15 },
  ];

  // Sample trending stocks
  const trendingStocks = [
    { symbol: "AAPL", name: "Apple Inc.", change: 1.25, price: 175.34 },
    { symbol: "TSLA", name: "Tesla Inc.", change: -2.1, price: 244.88 },
    { symbol: "MSFT", name: "Microsoft Corp.", change: 0.85, price: 315.23 },
    { symbol: "NVDA", name: "NVIDIA Corp.", change: 3.45, price: 422.67 },
    { symbol: "AMZN", name: "Amazon.com Inc.", change: -0.32, price: 132.45 },
  ];
  
  // Sample market news
  const marketNews = [
    { 
      id: 1, 
      title: "Fed Anonse Nouvo To Enterè", 
      source: "Finance Today", 
      time: "2 èdtan pase", 
      snippet: "Rezerv Federal anonse chanjman nan to enterè ki kapab afekte mache a...",
      tags: ["Makroekonomi", "Fed"]
    },
    { 
      id: 2, 
      title: "AAPL Lanse Nouvo Pwodui", 
      source: "Tech News", 
      time: "6 èdtan pase", 
      snippet: "Apple anonse dènye iPhone li a jodi a, ak plizyè amelyorasyon sou kamera...",
      tags: ["Teknoloji", "Apple"]
    },
    { 
      id: 3, 
      title: "Yo Prevwa Resesyon nan 2024", 
      source: "Economic Times", 
      time: "1 jou pase", 
      snippet: "Ekonomis yo prevwa yon resesyon posib nan premye mwatye 2024 la...",
      tags: ["Ekonomi", "Resesyon"]
    },
    { 
      id: 4, 
      title: "Kriz Enèji Kontinye nan Ewòp", 
      source: "Global Markets", 
      time: "2 jou pase", 
      snippet: "Pri enèji yo kontinye monte pandan Ewòp ap fè fas ak defi apwovizyònman...",
      tags: ["Enèji", "Ewòp"]
    },
  ];
  
  // Colors for sentiment pie chart
  const COLORS = ['#22c55e', '#60a5fa', '#ef4444'];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Analiz Mache</CardTitle>
              <CardDescription>Etidye tandans mache a ak done aksyon</CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Chèche yon aksyon..." 
                className="w-full md:w-auto"
                prefix={<Search className="h-4 w-4 mr-2 text-muted-foreground" />}
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="charts">Graf</TabsTrigger>
              <TabsTrigger value="news">Nouvèl ak Tandans</TabsTrigger>
            </TabsList>
            
            <TabsContent value="charts" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex space-x-2">
                  <Button 
                    variant={timeRange === "1d" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTimeRange("1d")}
                  >
                    1J
                  </Button>
                  <Button 
                    variant={timeRange === "1w" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTimeRange("1w")}
                  >
                    1S
                  </Button>
                  <Button 
                    variant={timeRange === "1m" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTimeRange("1m")}
                  >
                    1M
                  </Button>
                  <Button 
                    variant={timeRange === "3m" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTimeRange("3m")}
                  >
                    3M
                  </Button>
                  <Button 
                    variant={timeRange === "1y" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTimeRange("1y")}
                  >
                    1A
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant={chartType === "area" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType("area")}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Liy
                  </Button>
                  <Button 
                    variant={chartType === "bar" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType("bar")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Kolòn
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>AAPL - Apple Inc.</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-2xl font-bold">$157.02</span>
                        <Badge className="bg-green-100 text-green-800">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          3.1%
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Volim Jounalye</div>
                      <div>2.34M</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "area" ? (
                        <AreaChart
                          data={stockData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" />
                          <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                          />
                        </AreaChart>
                      ) : (
                        <BarChart
                          data={stockData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="volume" fill="#3b82f6" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analiz Teknik</CardTitle>
                    <CardDescription>Endikatè ak siyal teknik</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span>RSI (14)</span>
                        <div className="flex items-center">
                          <span className="font-medium">62.5</span>
                          <Badge className="ml-2 bg-yellow-100 text-yellow-800">Nèt</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span>MACD (12,26,9)</span>
                        <div className="flex items-center">
                          <span className="font-medium">1.89</span>
                          <Badge className="ml-2 bg-green-100 text-green-800">Achte</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span>Bollinger Bands</span>
                        <div className="flex items-center">
                          <span className="font-medium">Upper</span>
                          <Badge className="ml-2 bg-red-100 text-red-800">Vann</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span>Moving Avg (50)</span>
                        <div className="flex items-center">
                          <span className="font-medium">152.34</span>
                          <Badge className="ml-2 bg-green-100 text-green-800">Achte</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Moving Avg (200)</span>
                        <div className="flex items-center">
                          <span className="font-medium">145.67</span>
                          <Badge className="ml-2 bg-green-100 text-green-800">Achte</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Santiman Mache</CardTitle>
                    <CardDescription>Analiz santiman envèstisè</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sentimentData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {sentimentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-2 text-sm text-muted-foreground">
                      55% envèstisè yo pozitif sou AAPL
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="news" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Aksyon Popilè</CardTitle>
                    <CardDescription>Aksyon ki gen anpil aktivite jodi a</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trendingStocks.map((stock, index) => (
                        <div key={index} className="flex justify-between items-center pb-2 border-b border-border last:border-0 last:pb-0">
                          <div>
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-sm text-muted-foreground">{stock.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${stock.price}</div>
                            <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center justify-end`}>
                              {stock.change >= 0 ? (
                                <>
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                  +{stock.change}%
                                </>
                              ) : (
                                <>
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                  {stock.change}%
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Nouvèl Mache</CardTitle>
                    <CardDescription>Dènye nouvèl ak devlopman</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketNews.map((news) => (
                        <div key={news.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                          <h4 className="font-medium mb-1">{news.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{news.snippet}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              {news.source} · {news.time}
                            </div>
                            <div className="flex space-x-1">
                              {news.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Evènman Mache</CardTitle>
                    <CardDescription>Kalandriye evènman ekonomik</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Newspaper className="h-4 w-4 mr-2" />
                    Tout Evènman
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2 border-border">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                          <span className="text-sm font-medium">25</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Rapò To Enterè Fed</h4>
                          <div className="text-sm text-muted-foreground">2:00 PM ET</div>
                        </div>
                      </div>
                      <Badge>Enpòtan</Badge>
                    </div>
                    
                    <div className="flex justify-between border-b pb-2 border-border">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                          <span className="text-sm font-medium">26</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Rapò Travay ADP</h4>
                          <div className="text-sm text-muted-foreground">8:30 AM ET</div>
                        </div>
                      </div>
                      <Badge variant="outline">Mwayen</Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                          <span className="text-sm font-medium">27</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Rezilta AAPL Q3</h4>
                          <div className="text-sm text-muted-foreground">4:30 PM ET</div>
                        </div>
                      </div>
                      <Badge>Enpòtan</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalysis;
