
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import BankSection from '@/components/dashboard/BankSection';
import CreditSection from '@/components/dashboard/CreditSection';
import GamblingSection from '@/components/dashboard/gambling/GamblingSection';
import TradingSection from '@/components/dashboard/TradingSection';
import AccountSection from '@/components/dashboard/AccountSection';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const [activeSection, setActiveSection] = useState('bank');
  const { user, loading } = useAuth();
  
  // If URL has a hash, set the active section accordingly
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['bank', 'credit', 'gambling', 'trading', 'account'].includes(hash)) {
      setActiveSection(hash);
    }
  }, []);

  // Update URL hash when active section changes
  useEffect(() => {
    window.location.hash = activeSection;
  }, [activeSection]);
  
  if (loading) {
    return (
      <Layout>
        <div className="w-full flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-finance-blue"></div>
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto animate-fade-in">
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
      </div>
    </Layout>
  );
};

export default Index;
