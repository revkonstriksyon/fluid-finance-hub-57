
import { BarChart3, TrendingUp, Globe, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { marketData, newsData, analystRatings } from "./tradingData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const MarketAnalysis = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Analiz Mache</h2>
          <p className="text-muted-foreground">Suiv tandans ak nouvèl sou mache finansye yo</p>
        </div>
        <Button>
          <Share2 className="h-4 w-4 mr-2" />
          Pataje rapò a
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Rezime</TabsTrigger>
          <TabsTrigger value="sectors">Sektè</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="news">Nouvèl</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            {marketData.indices.map((index, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">{index.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold mb-1">{index.value}</div>
                  <div className={`flex items-center text-sm ${index.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp className={`h-4 w-4 mr-1 ${index.change < 0 ? 'rotate-180' : ''}`} />
                    {index.change > 0 ? '+' : ''}{index.change}% ({index.changeAmount})
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Pèfòmans Mache a</CardTitle>
              <CardDescription>Tandans jeneral sou dènye 30 jou yo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={marketData.performance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0066FF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#0066FF" fillOpacity={1} fill="url(#colorMarket)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analiz Ekspè yo</CardTitle>
                <CardDescription>Rekòmandasyon sou mache a</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analystRatings.map((analyst, i) => (
                    <div key={i} className="flex items-start justify-between pb-4 border-b last:border-0 border-gray-200 dark:border-gray-800">
                      <div>
                        <div className="font-medium">{analyst.name}</div>
                        <div className="text-sm text-muted-foreground">{analyst.firm}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className={
                          analyst.rating === "Achte" ? "bg-green-500" : 
                          analyst.rating === "Kenbe" ? "bg-yellow-500" : 
                          "bg-red-500"
                        }>
                          {analyst.rating}
                        </Badge>
                        <span className="text-xs text-muted-foreground mt-1">{analyst.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribisyon Sektè</CardTitle>
                <CardDescription>Pèfòmans pa sektè ekonomik</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketData.sectors} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="performance" fill="#0066FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sectors" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-xl font-medium">Analiz Sektè</p>
                  <p className="text-muted-foreground">Tap rantre nan kontni detaye sou sektè yo</p>
                </div>
                <Button>Chaje Detay</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-xl font-medium">Analiz Global</p>
                  <p className="text-muted-foreground">Tap rantre nan kontni detaye sou mache global yo</p>
                </div>
                <Button>Chaje Detay</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="news" className="space-y-6">
          <div className="grid gap-6">
            {newsData.map((news, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/4 bg-muted rounded-md aspect-video flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="md:w-3/4">
                      <h3 className="text-lg font-medium mb-2">{news.title}</h3>
                      <p className="text-muted-foreground mb-3">{news.summary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{news.source} • {news.date}</span>
                        <Button variant="outline" size="sm">Li Plis</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketAnalysis;
