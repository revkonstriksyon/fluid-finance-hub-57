
import { useState } from 'react';
import { Search, Plus, TrendingUp, TrendingDown, Bell, BellOff, Check } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { watchlistData } from './tradingData';
import { useToast } from "@/hooks/use-toast";

const Watchlist = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlist, setWatchlist] = useState(watchlistData);
  const [stockToAdd, setStockToAdd] = useState("");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [alertAbove, setAlertAbove] = useState("");
  const [alertBelow, setAlertBelow] = useState("");
  
  // Filter watchlist based on search
  const filteredWatchlist = searchQuery 
    ? watchlist.filter(item => 
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : watchlist;
  
  // Stock recommendations (example)
  const stockRecommendations = [
    { symbol: "NVDA", name: "NVIDIA Corp.", reason: "Strong earnings growth" },
    { symbol: "AVGO", name: "Broadcom Inc.", reason: "Dividend growth stock" },
    { symbol: "COST", name: "Costco Wholesale", reason: "Defensive consumer stock" },
    { symbol: "AMD", name: "Advanced Micro Devices", reason: "Growth in AI sector" },
  ];
  
  // Add stock to watchlist
  const addToWatchlist = () => {
    if (stockToAdd) {
      const newStock = {
        id: watchlist.length + 1,
        symbol: stockToAdd.toUpperCase(),
        name: `${stockToAdd.toUpperCase()} Corp.`, // Simplified for example
        price: Math.random() * 500 + 50,
        change: (Math.random() * 10) - 5,
        changePercent: (Math.random() * 5) - 2.5,
        alerts: {}
      };
      
      setWatchlist([...watchlist, newStock]);
      setStockToAdd("");
      
      toast({
        title: "Aksyon ajoute",
        description: `${newStock.symbol} ajoute nan watchlist ou.`,
        variant: "default",
      });
    }
  };
  
  // Remove from watchlist
  const removeFromWatchlist = (id: number) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
    
    toast({
      title: "Aksyon retire",
      description: "Aksyon an retire nan watchlist ou.",
      variant: "default",
    });
  };
  
  // Open alert dialog
  const openAlertDialog = (stock: any) => {
    setSelectedStock(stock);
    setAlertAbove(stock.alerts.above?.toString() || "");
    setAlertBelow(stock.alerts.below?.toString() || "");
    setAlertDialogOpen(true);
  };
  
  // Save alerts
  const saveAlerts = () => {
    if (selectedStock) {
      const updatedWatchlist = watchlist.map(item => {
        if (item.id === selectedStock.id) {
          return {
            ...item,
            alerts: {
              ...(alertAbove ? { above: parseFloat(alertAbove) } : {}),
              ...(alertBelow ? { below: parseFloat(alertBelow) } : {})
            }
          };
        }
        return item;
      });
      
      setWatchlist(updatedWatchlist);
      setAlertDialogOpen(false);
      
      toast({
        title: "Alèt konfigire",
        description: `Alèt pri konfigire pou ${selectedStock.symbol}.`,
        variant: "default",
      });
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="mb-6">
          <CardHeader className="flex-row flex items-center justify-between">
            <div>
              <CardTitle>Watchlist Mwen</CardTitle>
              <CardDescription>Swiv aksyon ki enterese ou</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Chèche..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajoute
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajoute aksyon nan watchlist</DialogTitle>
                    <DialogDescription>
                      Antre senbòl aksyon ou vle swiv.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="symbol">Senbòl Aksyon</Label>
                      <Input
                        id="symbol"
                        placeholder="Egz: AAPL, MSFT, GOOGL"
                        value={stockToAdd}
                        onChange={(e) => setStockToAdd(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={addToWatchlist}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajoute
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {filteredWatchlist.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Watchlist ou vid. Ajoute aksyon pou kòmanse swiv yo.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium">
                  <div className="col-span-5">Aksyon</div>
                  <div className="col-span-2 text-right">Pri</div>
                  <div className="col-span-2 text-right">Chanjman</div>
                  <div className="col-span-3 text-right">Alèt</div>
                </div>
                
                <div className="divide-y">
                  {filteredWatchlist.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 p-3 text-sm hover:bg-accent">
                      <div className="col-span-5">
                        <div className="font-medium">{item.symbol}</div>
                        <div className="text-xs text-muted-foreground">{item.name}</div>
                      </div>
                      <div className="col-span-2 text-right font-medium">${item.price.toFixed(2)}</div>
                      <div className={`col-span-2 text-right ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <div className="flex items-center justify-end">
                          {item.change >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          <span>
                            {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="col-span-3 text-right flex items-center justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openAlertDialog(item)}
                        >
                          {Object.keys(item.alerts).length > 0 ? (
                            <Bell className="h-4 w-4" />
                          ) : (
                            <BellOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFromWatchlist(item.id)}
                        >
                          Retire
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Rekòmandasyon</CardTitle>
            <CardDescription>Baze sou aktivite mache a</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockRecommendations.map((stock, index) => (
                <div key={index} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                    <div className="text-xs mt-1">{stock.reason}</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setStockToAdd(stock.symbol);
                      addToWatchlist();
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Ajoute
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Konprann Alèt</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <p>
              Alèt pri yo pèmèt ou resevwa notifikasyon lè yon aksyon rive nan yon pri espesifik.
            </p>
            <div>
              <h4 className="font-medium mb-1">Alèt Anwo</h4>
              <p className="text-muted-foreground">Resevwa notifikasyon lè pri a monte pi wo pase yon valè espesifik.</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Alèt Anba</h4>
              <p className="text-muted-foreground">Resevwa notifikasyon lè pri a desann pi ba pase yon valè espesifik.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alert Dialog */}
      <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfigire alèt pri</DialogTitle>
            <DialogDescription>
              {selectedStock && `${selectedStock.symbol} - ${selectedStock.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="priceAbove">Notifye m lè pri a monte pi wo pase</Label>
              <Input
                id="priceAbove"
                placeholder={`$${selectedStock?.price.toFixed(2) || ''}`}
                value={alertAbove}
                onChange={(e) => setAlertAbove(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priceBelow">Notifye m lè pri a desann pi ba pase</Label>
              <Input
                id="priceBelow"
                placeholder={`$${selectedStock?.price.toFixed(2) || ''}`}
                value={alertBelow}
                onChange={(e) => setAlertBelow(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAlertDialogOpen(false)}>
              Anile
            </Button>
            <Button onClick={saveAlerts}>
              <Check className="h-4 w-4 mr-2" />
              Anrejistre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Watchlist;
