
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ArrowUpDown, Eye, AlertCircle, CheckCircle, Banknote, ArrowDownCircle, ArrowUpCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for transactions
const mockTransactions = [
  {
    id: "TRX-78943",
    userId: "USR-8721",
    userName: "Jean Baptiste",
    type: "deposit",
    amount: "$1,250.00",
    date: "05 Apr 2025",
    status: "completed",
    method: "Bank Transfer",
    description: "Monthly salary deposit"
  },
  {
    id: "TRX-78942",
    userId: "USR-5432",
    userName: "Marie Claire",
    type: "withdrawal",
    amount: "$350.00",
    date: "05 Apr 2025",
    status: "completed",
    method: "ATM",
    description: "Weekly expenses"
  },
  {
    id: "TRX-78941",
    userId: "USR-6543",
    userName: "Michel Thomas",
    type: "transfer",
    amount: "$500.00",
    date: "04 Apr 2025",
    status: "completed",
    method: "Mobile Banking",
    description: "Payment to vendor"
  },
  {
    id: "TRX-78940",
    userId: "USR-9876",
    userName: "Sophie Blanc",
    type: "deposit",
    amount: "$2,000.00",
    date: "04 Apr 2025",
    status: "pending",
    method: "Check",
    description: "Business income"
  },
  {
    id: "TRX-78939",
    userId: "USR-4321",
    userName: "Claudine Moreau",
    type: "withdrawal",
    amount: "$1,500.00",
    date: "03 Apr 2025",
    status: "flagged",
    method: "Mobile Banking",
    description: "Large unexpected withdrawal"
  },
  {
    id: "TRX-78938",
    userId: "USR-2109",
    userName: "Laura Pierre",
    type: "deposit",
    amount: "$750.00",
    date: "03 Apr 2025",
    status: "completed",
    method: "Cash",
    description: "Personal savings"
  },
  {
    id: "TRX-78937",
    userId: "USR-8765",
    userName: "Robert Jean",
    type: "transfer",
    amount: "$300.00",
    date: "02 Apr 2025",
    status: "canceled",
    method: "Mobile Banking",
    description: "Error in recipient account"
  },
  {
    id: "TRX-78936",
    userId: "USR-3241",
    userName: "Paul Durand",
    type: "withdrawal",
    amount: "$100.00",
    date: "02 Apr 2025",
    status: "completed",
    method: "ATM",
    description: "Daily expenses"
  }
];

export const AdminTransactions = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter transactions based on search, type, and status
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Transaction status badge display
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: "bg-green-500", icon: <CheckCircle className="h-3 w-3" /> },
      pending: { color: "bg-yellow-500", icon: <RefreshCw className="h-3 w-3" /> },
      flagged: { color: "bg-red-500", icon: <AlertCircle className="h-3 w-3" /> },
      canceled: { color: "bg-gray-500", icon: <AlertCircle className="h-3 w-3" /> }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        {config.icon}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };
  
  // Transaction type icon
  const getTypeIcon = (type) => {
    switch(type) {
      case "deposit":
        return <ArrowDownCircle className="h-4 w-4 text-green-500" />;
      case "withdrawal":
        return <ArrowUpCircle className="h-4 w-4 text-red-500" />;
      case "transfer":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default:
        return <Banknote className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-finance-charcoal dark:text-white">
        Jesyon Tranzaksyon & Lajan
      </h2>
      
      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chèche pa ID tranzaksyon, non, oswa ID itilizatè..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Tip</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tout Tip</SelectItem>
                  <SelectItem value="deposit">Depo</SelectItem>
                  <SelectItem value="withdrawal">Retrè</SelectItem>
                  <SelectItem value="transfer">Transfè</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Statu</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tout Statu</SelectItem>
                  <SelectItem value="completed">Konplete</SelectItem>
                  <SelectItem value="pending">Annatant</SelectItem>
                  <SelectItem value="flagged">Sispèk</SelectItem>
                  <SelectItem value="canceled">Anile</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Triye
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Tranzaksyon yo ({filteredTransactions.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Itilizatè</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Kantite</TableHead>
                <TableHead>Dat</TableHead>
                <TableHead>Statu</TableHead>
                <TableHead>Aksyon</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{tx.userName}</span>
                      <span className="text-xs text-muted-foreground">{tx.userId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(tx.type)}
                      <span className="capitalize">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog onOpenChange={(open) => {
                        if (open) setSelectedTransaction(tx);
                        else setSelectedTransaction(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Banknote className="h-5 w-5" />
                              Detay Tranzaksyon
                            </DialogTitle>
                          </DialogHeader>
                          
                          {selectedTransaction && (
                            <div className="mt-4 space-y-4">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="font-medium">ID Tranzaksyon:</div>
                                <div>{selectedTransaction.id}</div>
                                
                                <div className="font-medium">Itilizatè:</div>
                                <div>{selectedTransaction.userName} ({selectedTransaction.userId})</div>
                                
                                <div className="font-medium">Tip:</div>
                                <div className="capitalize">{selectedTransaction.type}</div>
                                
                                <div className="font-medium">Kantite:</div>
                                <div>{selectedTransaction.amount}</div>
                                
                                <div className="font-medium">Dat:</div>
                                <div>{selectedTransaction.date}</div>
                                
                                <div className="font-medium">Statu:</div>
                                <div>{getStatusBadge(selectedTransaction.status)}</div>
                                
                                <div className="font-medium">Metòd:</div>
                                <div>{selectedTransaction.method}</div>
                                
                                <div className="font-medium">Deskripsyon:</div>
                                <div>{selectedTransaction.description}</div>
                              </div>
                              
                              <div className="pt-4 flex flex-wrap gap-2">
                                {selectedTransaction.status === 'flagged' && (
                                  <Button size="sm" variant="default" className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    Apwouve
                                  </Button>
                                )}
                                
                                {selectedTransaction.status !== 'canceled' && (
                                  <Button size="sm" variant="destructive" className="flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    Anile
                                  </Button>
                                )}
                                
                                {(selectedTransaction.status === 'completed' || selectedTransaction.status === 'flagged') && (
                                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                                    <RefreshCw className="h-4 w-4" />
                                    Remèt Lajan
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
