
import { useState } from 'react';
import { TrendingUp, TrendingDown, Search, AlertCircle, Check } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const StockTrading = () => {
  const { toast } = useToast();
  const [orderType, setOrderType] = useState("market");
  const [orderSide, setOrderSide] = useState("buy");
  const [stock, setStock] = useState({ symbol: "AAPL", name: "Apple Inc.", price: 175.34 });
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(stock.price);
  const [stopPrice, setStopPrice] = useState(stock.price * 0.95);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Total calculation
  const total = quantity * (orderType === "market" ? stock.price : price);
  
  // Handle order placement
  const placeOrder = () => {
    setShowConfirmation(false);
    toast({
      title: "Lòd soumèt!",
      description: `${orderSide === "buy" ? "Achte" : "Vann"} ${quantity} ${stock.symbol} a ${orderType === "market" ? "pri mache" : `$${price}`}`,
      variant: "default",
    });
  };
  
  // Popular stocks
  const popularStocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 175.34, change: 2.5, changePercent: 1.45 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 310.65, change: 1.2, changePercent: 0.39 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 138.21, change: -0.68, changePercent: -0.49 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 132.80, change: -0.8, changePercent: -0.60 },
    { symbol: "META", name: "Meta Platforms Inc.", price: 465.78, change: 3.45, changePercent: 0.75 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 265.55, change: -1.4, changePercent: -0.52 },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 452.80, change: 5.67, changePercent: 1.27 },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 185.29, change: 0.89, changePercent: 0.48 },
  ];
  
  // Filter stocks based on search
  const filteredStocks = searchQuery 
    ? popularStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularStocks;
  
  // Select a stock
  const selectStock = (selectedStock: any) => {
    setStock(selectedStock);
    setPrice(selectedStock.price);
    setStopPrice(selectedStock.price * 0.95);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Chèche Aksyon</CardTitle>
            <CardDescription>Antre senbòl la oswa non konpayi a</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="AAPL, Apple, MSFT, Microsoft..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="mt-4 rounded-md border divide-y">
              {filteredStocks.map((stock) => (
                <div 
                  key={stock.symbol} 
                  className="p-3 flex items-center justify-between hover:bg-accent cursor-pointer"
                  onClick={() => selectStock(stock)}
                >
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${stock.price.toFixed(2)}</div>
                    <div className={`text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center justify-end`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Aksyon popilè nan mache a</CardTitle>
            <CardDescription>Aksyon ki gen anpil aktivite jodi a</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-4 bg-muted p-3 text-sm font-medium">
                <div className="col-span-2">Aksyon</div>
                <div className="text-right">Pri</div>
                <div className="text-right">Chanjman</div>
              </div>
              
              <div className="divide-y">
                {popularStocks.slice(0, 5).map((stock) => (
                  <div 
                    key={stock.symbol} 
                    className="grid grid-cols-4 p-3 text-sm hover:bg-accent cursor-pointer"
                    onClick={() => selectStock(stock)}
                  >
                    <div className="col-span-2">
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground">{stock.name}</div>
                    </div>
                    <div className="text-right font-medium">${stock.price.toFixed(2)}</div>
                    <div className={`text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Pase Lòd</CardTitle>
            <CardDescription>{stock.symbol} - {stock.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={orderSide} onValueChange={setOrderSide} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="buy">Achte</TabsTrigger>
                <TabsTrigger value="sell">Vann</TabsTrigger>
              </TabsList>
              
              <div className="space-y-4">
                <div>
                  <Label>Tip Lòd</Label>
                  <Select value={orderType} onValueChange={setOrderType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chwazi tip lòd" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Lòd Mache</SelectItem>
                      <SelectItem value="limit">Lòd Limit</SelectItem>
                      <SelectItem value="stop">Stop-Loss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Kantite Aksyon</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                
                {orderType === "market" && (
                  <div>
                    <Label>Pri Mache</Label>
                    <Input value={`$${stock.price.toFixed(2)}`} disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Pri mache ka varye lè lòd la ekzekite
                    </p>
                  </div>
                )}
                
                {orderType === "limit" && (
                  <div>
                    <Label>Pri Limit</Label>
                    <Input 
                      type="number" 
                      min="0.01" 
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Lòd la ap ekzekite sèlman si pri a rive nan nivo limit la oswa pi bon
                    </p>
                  </div>
                )}
                
                {orderType === "stop" && (
                  <>
                    <div>
                      <Label>Pri Stop</Label>
                      <Input 
                        type="number" 
                        min="0.01" 
                        step="0.01"
                        value={stopPrice}
                        onChange={(e) => setStopPrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Pri Limit</Label>
                      <Input 
                        type="number" 
                        min="0.01" 
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex items-start text-xs text-muted-foreground">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                      <p>
                        Lòd la ap vin aktif lè pri a rive nan nivo stop la, epi li ap ekzekite nan pri limit la oswa pi bon
                      </p>
                    </div>
                  </>
                )}
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Pri estimasyon:</span>
                    <span className="font-medium">${orderType === "market" ? stock.price.toFixed(2) : price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm">Total estimasyon:</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  
                  <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        {orderSide === "buy" ? "Achte" : "Vann"} {stock.symbol}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Konfime lòd ou</DialogTitle>
                        <DialogDescription>
                          Verifye detay lòd ou anvan ou soumèt li
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Aksyon:</span>
                          <span className="font-medium">{stock.symbol} - {stock.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tip lòd:</span>
                          <span className="font-medium">
                            {orderSide === "buy" ? "Achte" : "Vann"} - {
                              orderType === "market" ? "Lòd Mache" : 
                              orderType === "limit" ? "Lòd Limit" : "Stop-Loss"
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Kantite:</span>
                          <span className="font-medium">{quantity} aksyon</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pri:</span>
                          <span className="font-medium">
                            {orderType === "market" ? "Pri mache" : `$${price.toFixed(2)}`}
                            {orderType === "stop" ? ` (Stop: $${stopPrice.toFixed(2)})` : ""}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total estimasyon:</span>
                          <span className="font-medium">${total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                          Anile
                        </Button>
                        <Button onClick={placeOrder}>
                          <Check className="h-4 w-4 mr-2" />
                          Konfime Lòd
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
            <div className="space-y-2">
              <p className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                Mache aksyon yo gen risk. Asire w ke ou konprann risk yo anvan ou envesti.
              </p>
              <p>
                Tout lòd mache yo ekzekite pandan lè mache yo (9:30 AM - 4:00 PM ET, Lendi-Vandredi).
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StockTrading;
