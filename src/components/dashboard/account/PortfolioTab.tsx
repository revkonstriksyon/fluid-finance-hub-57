
import { useEffect, useState } from 'react';
import { CreditCard, BarChart2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { BankAccount } from '@/types/auth';

const PortfolioTab = () => {
  const { user, bankAccounts } = useAuth();
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);

  useEffect(() => {
    // Calculate totals from bankAccounts
    if (bankAccounts && bankAccounts.length > 0) {
      const assets = bankAccounts.reduce((sum, account) => {
        return account.balance > 0 ? sum + account.balance : sum;
      }, 0);
      
      const debt = bankAccounts.reduce((sum, account) => {
        return account.balance < 0 ? sum + Math.abs(account.balance) : sum;
      }, 0);
      
      setTotalAssets(assets);
      setTotalDebt(debt);
    }
  }, [bankAccounts]);

  return (
    <div className="space-y-4">
      <div className="finance-card">
        <h3 className="section-title mb-6">Rezime Finansye</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-finance-lightGray/50 dark:bg-white/5 rounded-lg p-4">
            <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-1">Total Aktif</p>
            <p className="text-xl font-bold">
              ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="bg-finance-lightGray/50 dark:bg-white/5 rounded-lg p-4">
            <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-1">Total Dèt</p>
            <p className="text-xl font-bold">
              ${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {bankAccounts.length > 0 ? (
            <>
              <div className="flex justify-between items-center p-3 border-b border-finance-midGray/30 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-finance-blue/20 p-2 rounded-lg">
                    <CreditCard className="h-5 w-5 text-finance-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Kont Labank</p>
                    <p className="text-sm text-finance-charcoal/70 dark:text-white/70">{bankAccounts.length} kont aktif</p>
                  </div>
                </div>
                <p className="font-bold">
                  ${bankAccounts.reduce((sum, account) => sum + (account.balance > 0 ? account.balance : 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
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
                <p className="font-bold">$0.00</p>
              </div>
              
              <div className="flex justify-between items-center p-3">
                <div className="flex items-center gap-3">
                  <div className="bg-finance-danger/20 p-2 rounded-lg">
                    <CreditCard className="h-5 w-5 text-finance-danger" />
                  </div>
                  <div>
                    <p className="font-medium">Kredi</p>
                    <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Prè</p>
                  </div>
                </div>
                <p className="font-bold text-finance-danger">
                  ${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </>
          ) : (
            <div className="p-3 text-center">
              <p className="text-finance-charcoal/70 dark:text-white/70">Ou pa gen okenn kont oswa tranzaksyon anrejistre pou kounyeya.</p>
              <p className="text-sm mt-2">Kont ou aktif men li poko gen tranzaksyon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioTab;
