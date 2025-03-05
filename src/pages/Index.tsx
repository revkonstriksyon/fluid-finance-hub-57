
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import BankSection from '@/components/dashboard/BankSection';
import CreditSection from '@/components/dashboard/CreditSection';
import GamblingSection from '@/components/dashboard/gambling/GamblingSection';
import TradingSection from '@/components/dashboard/TradingSection';
import AccountSection from '@/components/dashboard/AccountSection';
import { useAuth } from '@/contexts/auth';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [activeSection, setActiveSection] = useState('bank');
  const { profile, userLoading, user } = useAuth();
  const [loadingShown, setLoadingShown] = useState(true);
  
  console.log("Index page rendered - Auth state:", { 
    user: !!user, 
    profile: !!profile, 
    userLoading 
  });
  
  // Automatically show the bank section when user logs in
  useEffect(() => {
    if (profile && !userLoading) {
      setActiveSection('bank');
      setLoadingShown(false);
    }
    
    // Auto-hide loading message after 2 seconds even if still loading
    const timer = setTimeout(() => {
      setLoadingShown(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [profile, userLoading]);
  
  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto animate-fade-in">
        {userLoading && loadingShown ? (
          <div className="flex flex-col justify-center items-center p-8 gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-t-finance-blue border-r-transparent border-b-finance-blue border-l-transparent animate-spin"></div>
            <p className="text-lg font-medium text-finance-blue">Chajman...</p>
          </div>
        ) : (
          <>
            <div className="my-6 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveSection('bank')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSection === 'bank' 
                    ? 'bg-finance-blue text-white' 
                    : 'bg-white dark:bg-finance-navy/70 text-finance-charcoal dark:text-white/80 hover:bg-finance-lightGray dark:hover:bg-white/5'
                }`}
              >
                My Bank 🏦
              </button>
              <button
                onClick={() => setActiveSection('credit')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSection === 'credit' 
                    ? 'bg-finance-blue text-white' 
                    : 'bg-white dark:bg-finance-navy/70 text-finance-charcoal dark:text-white/80 hover:bg-finance-lightGray dark:hover:bg-white/5'
                }`}
              >
                Kredi 💳
              </button>
              <button
                onClick={() => setActiveSection('gambling')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSection === 'gambling' 
                    ? 'bg-finance-blue text-white' 
                    : 'bg-white dark:bg-finance-navy/70 text-finance-charcoal dark:text-white/80 hover:bg-finance-lightGray dark:hover:bg-white/5'
                }`}
              >
                Jeu & Pari 🎰
              </button>
              <button
                onClick={() => setActiveSection('trading')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSection === 'trading' 
                    ? 'bg-finance-blue text-white' 
                    : 'bg-white dark:bg-finance-navy/70 text-finance-charcoal dark:text-white/80 hover:bg-finance-lightGray dark:hover:bg-white/5'
                }`}
              >
                Trading & Bous 📈
              </button>
              <button
                onClick={() => setActiveSection('account')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSection === 'account' 
                    ? 'bg-finance-blue text-white' 
                    : 'bg-white dark:bg-finance-navy/70 text-finance-charcoal dark:text-white/80 hover:bg-finance-lightGray dark:hover:bg-white/5'
                }`}
              >
                Mon Compte & Sosyal 👤
              </button>
            </div>
            
            {activeSection === 'bank' && <BankSection />}
            {activeSection === 'credit' && <CreditSection />}
            {activeSection === 'gambling' && <GamblingSection />}
            {activeSection === 'trading' && <TradingSection />}
            {activeSection === 'account' && <AccountSection />}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
