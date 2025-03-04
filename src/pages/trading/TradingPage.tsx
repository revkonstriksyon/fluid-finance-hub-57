
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioDashboard from '@/components/trading/PortfolioDashboard';
import StockTrading from '@/components/trading/StockTrading';
import Watchlist from '@/components/trading/Watchlist';
import MarketAnalysis from '@/components/trading/MarketAnalysis';
import AutoInvestment from '@/components/trading/AutoInvestment';
import ETFBonds from '@/components/trading/ETFBonds';
import TransactionHistory from '@/components/trading/TransactionHistory';
import Education from '@/components/trading/Education';
import SecuritySettings from '@/components/trading/SecuritySettings';

const TradingPage = () => {
  const [activeTab, setActiveTab] = useState("portfolio");
  
  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto py-6 animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Trading & Bous 📈</h1>
        
        <Tabs defaultValue="portfolio" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 w-full mb-6">
            <TabsTrigger value="portfolio">Pòtfolyo</TabsTrigger>
            <TabsTrigger value="trade">Achte/Vann</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="analysis">Analiz Mache</TabsTrigger>
            <TabsTrigger value="autoinvest">Robo-Advisor</TabsTrigger>
            <TabsTrigger value="etfbonds">ETF & Obligasyon</TabsTrigger>
            <TabsTrigger value="history">Rapò & Istorik</TabsTrigger>
            <TabsTrigger value="education">Edikasyon</TabsTrigger>
            <TabsTrigger value="security">Sekirite</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolio">
            <PortfolioDashboard />
          </TabsContent>
          
          <TabsContent value="trade">
            <StockTrading />
          </TabsContent>
          
          <TabsContent value="watchlist">
            <Watchlist />
          </TabsContent>
          
          <TabsContent value="analysis">
            <MarketAnalysis />
          </TabsContent>
          
          <TabsContent value="autoinvest">
            <AutoInvestment />
          </TabsContent>
          
          <TabsContent value="etfbonds">
            <ETFBonds />
          </TabsContent>
          
          <TabsContent value="history">
            <TransactionHistory />
          </TabsContent>
          
          <TabsContent value="education">
            <Education />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TradingPage;
