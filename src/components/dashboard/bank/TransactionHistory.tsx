
import { useState, useEffect } from 'react';
import { Transaction } from '@/hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Download, Search, Filter, Calendar, 
  SortAsc, SortDesc 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface TransactionHistoryProps {
  transactions: Transaction[];
  transactionsLoading: boolean;
}

// Transaction categories
const categories = {
  'deposit': 'Depo',
  'withdrawal': 'Retrè',
  'transfer': 'Transfè',
  'payment': 'Peman',
  'food': 'Manje',
  'transport': 'Transpò',
  'shopping': 'Atchat',
  'utilities': 'Sèvis',
  'other': 'Lòt'
};

const TransactionHistory = ({ transactions, transactionsLoading }: TransactionHistoryProps) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({
    start: null, end: null
  });
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'}>({
    key: 'created_at', direction: 'desc'
  });
  const [isExporting, setIsExporting] = useState(false);
  
  const { toast } = useToast();

  // Automatically categorize transactions
  const getCategoryFromTransaction = (transaction: Transaction): string => {
    const description = (transaction.description || '').toLowerCase();
    if (transaction.transaction_type === 'deposit') return 'deposit';
    if (transaction.transaction_type === 'withdrawal') return 'withdrawal';
    if (description.includes('transfè')) return 'transfer';
    if (description.includes('peman')) return 'payment';
    if (description.includes('manje') || description.includes('restoran')) return 'food';
    if (description.includes('transpò') || description.includes('taksi')) return 'transport';
    if (description.includes('magazen') || description.includes('achte')) return 'shopping';
    if (description.includes('dlo') || description.includes('elektrisite')) return 'utilities';
    return 'other';
  };

  // Filter transactions when filters change
  useEffect(() => {
    let result = [...transactions];
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter(tx => 
        (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        tx.transaction_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount.toString().includes(searchTerm)
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(tx => getCategoryFromTransaction(tx) === categoryFilter);
    }
    
    // Apply date range filter
    if (dateRange.start) {
      result = result.filter(tx => new Date(tx.created_at) >= dateRange.start!);
    }
    if (dateRange.end) {
      result = result.filter(tx => new Date(tx.created_at) <= dateRange.end!);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'created_at') {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
    
    setFilteredTransactions(result);
  }, [transactions, searchTerm, categoryFilter, dateRange, sortConfig]);

  // Handle export to CSV
  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "Pa gen tranzaksyon",
        description: "Pa gen okenn tranzaksyon pou ekspòte.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      // Convert transactions to CSV
      const headers = ["Dat", "Kategori", "Tip", "Montan", "Deskripsyon"];
      const csvRows = [headers];

      filteredTransactions.forEach(tx => {
        const row = [
          new Date(tx.created_at).toLocaleDateString('fr-FR'),
          categories[getCategoryFromTransaction(tx) as keyof typeof categories],
          tx.transaction_type,
          tx.amount.toString(),
          tx.description || ''
        ];
        csvRows.push(row);
      });

      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      
      // Create a blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `tranzaksyon_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Ekspòtasyon reyisi",
        description: "Tranzaksyon yo ekspòte avèk siksè.",
      });
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast({
        title: "Erè ekspòtasyon",
        description: "Pa kapab ekspòte tranzaksyon yo. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    toast({
      title: "Fonksyon pako disponib",
      description: "Ekspòtasyon PDF ap disponib byento.",
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter(null);
    setDateRange({ start: null, end: null });
    setSortConfig({ key: 'created_at', direction: 'desc' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Chèche nan tranzaksyon yo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Kategori
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                Tout Kategori
              </DropdownMenuItem>
              {Object.entries(categories).map(([key, value]) => (
                <DropdownMenuItem key={key} onClick={() => setCategoryFilter(key)}>
                  {value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Dat
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDateRange({ start: null, end: null })}>
                Tout dat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const today = new Date();
                setDateRange({ 
                  start: new Date(today.setHours(0, 0, 0, 0)), 
                  end: new Date() 
                });
              }}>
                Jodi a
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const today = new Date();
                const weekStart = new Date();
                weekStart.setDate(today.getDate() - 7);
                setDateRange({ start: weekStart, end: today });
              }}>
                7 dènye jou
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const today = new Date();
                const monthStart = new Date();
                monthStart.setDate(today.getDate() - 30);
                setDateRange({ start: monthStart, end: today });
              }}>
                30 dènye jou
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {sortConfig.direction === 'asc' ? (
                  <SortAsc className="h-4 w-4 mr-2" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-2" />
                )}
                Triye
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortConfig({ key: 'created_at', direction: 'desc' })}>
                Pli resan anwo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortConfig({ key: 'created_at', direction: 'asc' })}>
                Pli ansyen anwo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortConfig({ key: 'amount', direction: 'desc' })}>
                Montan (wo a ba)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortConfig({ key: 'amount', direction: 'asc' })}>
                Montan (ba a wo)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {(searchTerm || categoryFilter || dateRange.start || dateRange.end) && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Efase filtè
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Ekspòte
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExport}>
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Istorik Tranzaksyon</CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="text-center py-8">
              <p>Ap chaje tranzaksyon yo...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dat</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Deskripsyon</TableHead>
                    <TableHead className="text-right">Montan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {categories[getCategoryFromTransaction(transaction) as keyof typeof categories]}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.description || '-'}</TableCell>
                      <TableCell className={`text-right font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} HTG
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Pa gen okenn tranzaksyon ki koresponn ak kritè yo.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;
