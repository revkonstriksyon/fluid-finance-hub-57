import { useState } from 'react';
import { Transaction } from '@/hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface RecentTransactionsProps {
  transactions: Transaction[];
  transactionsLoading: boolean;
}

const RecentTransactions = ({ transactions, transactionsLoading }: RecentTransactionsProps) => {
  const { toast } = useToast();
  const recentTransactions = transactions.slice(0, 5);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportTransactions = () => {
    if (transactions.length === 0) {
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
      const headers = ["Dat", "Tip", "Montan", "Deskripsyon"];
      const csvRows = [headers];

      transactions.forEach(tx => {
        const row = [
          new Date(tx.created_at).toLocaleDateString('fr-FR'),
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Resan Tranzaksyon</CardTitle>
          <CardDescription>Dènye tranzaksyon ou yo</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportTransactions} disabled={isExporting || transactions.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Ap ekspòte..." : "Ekspòte"}
        </Button>
      </CardHeader>
      <CardContent>
        {transactionsLoading ? (
          <p className="text-center py-4">Ap chaje tranzaksyon yo...</p>
        ) : recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{transaction.description || (transaction.amount > 0 ? 'Depo' : 'Retrè')}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <p className={transaction.amount > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} HTG
                </p>
              </div>
            ))}
            <Button variant="link" className="w-full mt-2" onClick={() => document.querySelector('[value="transactions"]')?.dispatchEvent(new Event('click'))}>
              Wè tout tranzaksyon
            </Button>
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground">Pa gen okenn tranzaksyon nan istwa ou.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
