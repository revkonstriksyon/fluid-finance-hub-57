
import { ArrowDown, ArrowUp, CreditCard, Eye, EyeOff, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

const BankSection = () => {
  const [hideBalance, setHideBalance] = useState(false);
  
  const toggleBalance = () => {
    setHideBalance(!hideBalance);
  };
  
  // Sample transaction data
  const transactions = [
    { id: 1, type: 'deposit', amount: 1500, description: 'Salè Mwa Jen', date: '24 Jen, 2023', icon: ArrowDown, iconColor: 'text-finance-success'},
    { id: 2, type: 'withdrawal', amount: 45, description: 'Market Place', date: '22 Jen, 2023', icon: ArrowUp, iconColor: 'text-finance-danger'},
    { id: 3, type: 'withdrawal', amount: 120, description: 'Achte Telefòn', date: '20 Jen, 2023', icon: ArrowUp, iconColor: 'text-finance-danger'},
    { id: 4, type: 'deposit', amount: 300, description: 'Travay Freelance', date: '18 Jen, 2023', icon: ArrowDown, iconColor: 'text-finance-success'},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="balance-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white/90">Total Balans</h3>
          <Button variant="ghost" size="icon" onClick={toggleBalance} className="text-white/80 hover:text-white">
            {hideBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="mb-4">
          <h2 className="text-3xl font-bold">
            {hideBalance ? '••••••' : '$1,985.40'}
          </h2>
          <p className="text-white/70 text-sm mt-1">Dènye mizajou: Jodi a, 10:45 AM</p>
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
            <ArrowDown className="h-4 w-4 mr-2" />
            Depoze
          </Button>
          <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
            <ArrowUp className="h-4 w-4 mr-2" />
            Voye
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="finance-card">
          <h3 className="section-title mb-6">Kont yo</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-finance-lightGray/50 dark:bg-white/5 rounded-lg">
              <div className="flex items-center">
                <div className="bg-finance-blue/20 p-2 rounded-lg mr-3">
                  <CreditCard className="h-5 w-5 text-finance-blue" />
                </div>
                <div>
                  <p className="font-medium">Kont Kouran</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Aksè fasilman ak lajan</p>
                </div>
              </div>
              <p className="font-bold">{hideBalance ? '••••' : '$1,450'}</p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-finance-lightGray/50 dark:bg-white/5 rounded-lg">
              <div className="flex items-center">
                <div className="bg-finance-gold/20 p-2 rounded-lg mr-3">
                  <CreditCard className="h-5 w-5 text-finance-gold" />
                </div>
                <div>
                  <p className="font-medium">Kont Epay</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Ekonomi avèk enterè</p>
                </div>
              </div>
              <p className="font-bold">{hideBalance ? '••••' : '$535.40'}</p>
            </div>
            
            <Button variant="outline" className="w-full border-dashed">
              <Plus className="h-4 w-4 mr-2" />
              Ajoute Nouvo Kont
            </Button>
          </div>
        </div>
        
        <div className="finance-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title mb-0">Dènye Tranzaksyon</h3>
            <Button variant="link" className="text-finance-blue">Wè Tout</Button>
          </div>
          
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
        </div>
      </div>
    </div>
  );
};

export default BankSection;
