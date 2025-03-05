
import { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
  icon: typeof ArrowDown | typeof ArrowUp;
  iconColor: string;
}

interface BankAccountTransactionsProps {
  accountId: string;
}

const BankAccountTransactions = ({ accountId }: BankAccountTransactionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && accountId) {
      fetchTransactions();
    }
  }, [user, accountId]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform transaction data
        const formattedTransactions = data.map(transaction => {
          const isDeposit = transaction.transaction_type === 'deposit';
          return {
            id: transaction.id,
            type: transaction.transaction_type as 'deposit' | 'withdrawal',
            amount: transaction.amount,
            description: transaction.description || (isDeposit ? 'Depo' : 'Retrè'),
            date: new Date(transaction.created_at).toLocaleDateString('fr-FR'),
            icon: isDeposit ? ArrowDown : ArrowUp,
            iconColor: isDeposit ? 'text-finance-success' : 'text-finance-danger'
          };
        });
        
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Erè",
        description: "Pa kapab jwenn tranzaksyon yo. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-lg mr-3" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-4 text-finance-charcoal/70 dark:text-white/70">
        Pa gen okenn tranzaksyon pou montre.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-finance-lightGray/50 dark:hover:bg-white/5 rounded-lg transition-colors">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${transaction.type === 'deposit' ? 'bg-finance-success/10' : 'bg-finance-danger/10'}`}>
              <transaction.icon className={`h-5 w-5 ${transaction.iconColor}`} />
            </div>
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-finance-charcoal/70 dark:text-white/70">{transaction.date}</p>
            </div>
          </div>
          <p className={`font-bold ${transaction.type === 'deposit' ? 'text-finance-success' : 'text-finance-danger'}`}>
            {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BankAccountTransactions;
