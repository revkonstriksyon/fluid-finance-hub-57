
import { useState } from 'react';
import { Search, Download, Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { transactionsData, portfolioPerformanceData } from './tradingData';

const TransactionHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [activeTab, setActiveTab] = useState("transactions");
  
  // Filter transactions
  const filteredTransactions = transactionsData.filter(transaction => {
    const matchesSearch = searchQuery === "" ||
      transaction.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = transactionType === "all" || transaction.type === transactionType;
    
    // For simplicity, we're not implementing date range filtering in this example
    
    return matchesSearch && matchesType;
  });
  
  // Sample performance comparison data
  const performanceComparisonData = [
    { month: "Jan", portfolio: 5.2, sp500: 4.8, nasdaq: 6.5 },
    { month: "Feb", portfolio: -2.1, sp500: -1.8, nasdaq: -2.5 },
    { month: "Mar", portfolio: 3.5, sp500: 3.2, nasdaq: 4.1 },
    { month: "Apr", portfolio: 4.2, sp500: 3.8, nasdaq: 5.0 },
    { month: "May", portfolio: -1.5, sp500: -1.2, nasdaq: -1.8 },
    { month: "Jun", portfolio: 2.8, sp500: 2.5, nasdaq: 3.2 },
    { month: "Jul", portfolio: 3.9, sp500: 3.5, nasdaq: 4.2 },
    { month: "Aug", portfolio: 1.2, sp500: 1.0, nasdaq: 1.5 },
    { month: "Sep", portfolio: -2.8, sp500: -2.5, nasdaq: -3.2 },
    { month: "Oct", portfolio: 4.5, sp500: 4.0, nasdaq: 5.2 },
    { month: "Nov", portfolio: 3.2, sp500: 2.8, nasdaq: 3.8 },
    { month: "Dec", portfolio: 2.5, sp500: 2.2, nasdaq: 2.8 },
  ];
  
  // Sample sector performance data
  const sectorPerformanceData = [
    { name: "Teknoloji", value: 9.8 },
    { name: "Swen Sante", value: 5.2 },
    { name: "Finansye", value: 7.5 },
    { name: "Enèji", value: -3.2 },
    { name: "Konsomatè", value: 4.1 },
    { name: "Endistri", value: 6.3 },
    { name: "Kominikasyon", value: 8.5 },
    { name: "Materyèl", value: 3.8 },
    { name: "Sèvis Piblik", value: 2.1 },
    { name: "Imobilye", value: -1.5 },
  ];
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Istorik Tranzaksyon</TabsTrigger>
          <TabsTrigger value="performance">Rapò Pèfòmans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chèche pa senbòl, non..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs value={transactionType} onValueChange={setTransactionType} className="flex-1">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Tout</TabsTrigger>
                <TabsTrigger value="buy">Acha</TabsTrigger>
                <TabsTrigger value="sell">Vant</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Peryòd</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setDateRange("all")}>
                  Tout tan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("7days")}>
                  7 dènye jou
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("30days")}>
                  30 dènye jou
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("90days")}>
                  90 dènye jou
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("1year")}>
                  1 ane
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button className="w-full md:w-auto" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              <span>Ekspòte</span>
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dat</TableHead>
                      <TableHead>Tip</TableHead>
                      <TableHead>Senbòl</TableHead>
                      <TableHead>Non</TableHead>
                      <TableHead className="text-right">Aksyon</TableHead>
                      <TableHead className="text-right">Pri</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Estati</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          Pa gen tranzaksyon ki koresponn ak filtè w yo
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              transaction.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type === 'buy' ? 'Acha' : 'Vann'}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">{transaction.symbol}</TableCell>
                          <TableCell>{transaction.name}</TableCell>
                          <TableCell className="text-right">{transaction.shares}</TableCell>
                          <TableCell className="text-right">${transaction.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${transaction.total.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status === 'completed' ? 'Konplete' : 
                               transaction.status === 'pending' ? 'An atant' : 'Anile'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Rezime Aktivite</CardTitle>
              <CardDescription>Rezime aktivite kont ou a</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Acha</div>
                  <div className="text-2xl font-bold">$2,019.73</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Vant</div>
                  <div className="text-2xl font-bold">$265.55</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Konpayi Diferan</div>
                  <div className="text-2xl font-bold">4</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Tranzaksyon Total</div>
                  <div className="text-2xl font-bold">{transactionsData.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pèfòmans Pòtfolyo</CardTitle>
              <CardDescription>Pèfòmans pòtfolyo ou konpare ak endèks mache yo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceComparisonData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} domain={[-4, 8]} />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                    <Line type="monotone" dataKey="portfolio" stroke="#4285F4" name="Pòtfolyo Ou" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="sp500" stroke="#34A853" name="S&P 500" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nasdaq" stroke="#FBBC05" name="NASDAQ" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <div className="text-sm font-medium">Pòtfolyo Ou (YTD)</div>
                  <div className="text-xl font-bold text-green-600">+18.2%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">S&P 500 (YTD)</div>
                  <div className="text-xl font-bold text-green-600">+16.5%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">NASDAQ (YTD)</div>
                  <div className="text-xl font-bold text-green-600">+21.8%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Konparezon</div>
                  <div className="text-xl font-bold text-green-600">+1.7%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pèfòmans Sektè</CardTitle>
                <CardDescription>Retou sou envestisman pa sektè</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sectorPerformanceData.map((sector) => (
                    <div key={sector.name} className="flex items-center justify-between">
                      <span className="font-medium text-sm">{sector.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 w-40 bg-gray-100 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${sector.value >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.abs(sector.value) * 5}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm ${sector.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {sector.value >= 0 ? '+' : ''}{sector.value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rapò Pèfòmans</CardTitle>
                <CardDescription>Telechaje rapò detaye yo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Rapò Mwayèl</h4>
                      <p className="text-sm text-muted-foreground">
                        Mwa Mas 2024
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Rapò Trimèt</h4>
                      <p className="text-sm text-muted-foreground">
                        T1 2024
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Rapò Tranzaksyon</h4>
                      <p className="text-sm text-muted-foreground">
                        Janvye - Mas 2024
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Rapò Taks</h4>
                      <p className="text-sm text-muted-foreground">
                        Ane Fiskal 2023
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionHistory;
