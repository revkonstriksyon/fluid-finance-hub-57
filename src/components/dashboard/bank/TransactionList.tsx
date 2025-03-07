
import { ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from '@/hooks/useBankData';
import { formatDistanceToNow } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
}

export const TransactionList = ({ transactions, loading }: TransactionListProps) => {
  // Get icon for transaction type
  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'deposit':
      case 'transfer_received':
        return ArrowDown;
      case 'withdrawal':
      case 'transfer_sent':
      case 'payment':
        return ArrowUp;
      default:
        return ArrowRight;
    }
  };

  // Format transaction amount with +/- sign
  const formatTransactionAmount = (transaction: Transaction) => {
    const isPositive = transaction.transaction_type === 'deposit' || transaction.transaction_type === 'transfer_received';
    return `${isPositive ? '+' : '-'}$${Math.abs(transaction.amount)}`;
  };

  // Get transaction color class
  const getTransactionColorClass = (transaction: Transaction) => {
    const isPositive = transaction.transaction_type === 'deposit' || transaction.transaction_type === 'transfer_received';
    return isPositive ? 'text-finance-success' : 'text-finance-danger';
  };

  // Get background color class for transaction icon
  const getTransactionBgClass = (transaction: Transaction) => {
    const isPositive = transaction.transaction_type === 'deposit' || transaction.transaction_type === 'transfer_received';
    return isPositive ? 'bg-finance-success/10' : 'bg-finance-danger/10';
  };

  // Format relative time for transaction
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="finance-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-title mb-0">Dènye Tranzaksyon</h3>
        <Button variant="link" className="text-finance-blue">Wè Tout</Button>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          Array(4).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full bg-finance-lightGray/30" />
          ))
        ) : transactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-finance-charcoal/70 dark:text-white/70">Ou pa gen okenn tranzaksyon pou kounye a.</p>
          </div>
        ) : (
          transactions.map((transaction) => {
            const TransactionIcon = getTransactionIcon(transaction.transaction_type);
            return (
              <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-finance-lightGray/50 dark:hover:bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <div className={`${getTransactionBgClass(transaction)} p-2 rounded-lg mr-3`}>
                    <TransactionIcon className={`h-5 w-5 ${getTransactionColorClass(transaction)}`} />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-finance-charcoal/70 dark:text-white/70">
                      {formatRelativeTime(transaction.created_at)}
                    </p>
                  </div>
                </div>
                <p className={`font-bold ${getTransactionColorClass(transaction)}`}>
                  {formatTransactionAmount(transaction)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
