
import { CreditCard, BarChart2 } from 'lucide-react';

const PortfolioTab = () => {
  return (
    <div className="space-y-4">
      <div className="finance-card">
        <h3 className="section-title mb-6">Rezime Finansye</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-finance-lightGray/50 dark:bg-white/5 rounded-lg p-4">
            <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-1">Total Aktif</p>
            <p className="text-xl font-bold">$7,246.38</p>
          </div>
          
          <div className="bg-finance-lightGray/50 dark:bg-white/5 rounded-lg p-4">
            <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-1">Total Dèt</p>
            <p className="text-xl font-bold">$1,240.00</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 border-b border-finance-midGray/30 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-finance-blue/20 p-2 rounded-lg">
                <CreditCard className="h-5 w-5 text-finance-blue" />
              </div>
              <div>
                <p className="font-medium">Kont Labank</p>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">2 kont aktif</p>
              </div>
            </div>
            <p className="font-bold">$1,985.40</p>
          </div>
          
          <div className="flex justify-between items-center p-3 border-b border-finance-midGray/30 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-finance-gold/20 p-2 rounded-lg">
                <BarChart2 className="h-5 w-5 text-finance-gold" />
              </div>
              <div>
                <p className="font-medium">Envestisman</p>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Aksyon & ETF</p>
              </div>
            </div>
            <p className="font-bold">$5,241.82</p>
          </div>
          
          <div className="flex justify-between items-center p-3">
            <div className="flex items-center gap-3">
              <div className="bg-finance-danger/20 p-2 rounded-lg">
                <CreditCard className="h-5 w-5 text-finance-danger" />
              </div>
              <div>
                <p className="font-medium">Kredi</p>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">1 prè aktif</p>
              </div>
            </div>
            <p className="font-bold text-finance-danger">-$1,240.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTab;
