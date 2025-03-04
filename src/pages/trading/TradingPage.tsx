
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioDashboard from "@/components/trading/PortfolioDashboard";
import StockTrading from "@/components/trading/StockTrading";
import Watchlist from "@/components/trading/Watchlist";
import MarketAnalysis from "@/components/trading/MarketAnalysis";
import AutoInvestment from "@/components/trading/AutoInvestment";
import ETFBonds from "@/components/trading/ETFBonds";
import TransactionHistory from "@/components/trading/TransactionHistory";
import Education from "@/components/trading/Education";
import SecuritySettings from "@/components/trading/SecuritySettings";

const TradingPage = () => {
  const [activeTab, setActiveTab] = useState("portfolio");
  
  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Trading & Bous</h1>
          <p className="text-muted-foreground">Jere envestisman ou yo epi swiv mache a</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-9 mb-6">
            <TabsTrigger value="portfolio">Pòtfolyo</TabsTrigger>
            <TabsTrigger value="trade">Achte/Vann</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="analysis">Analiz</TabsTrigger>
            <TabsTrigger value="autoinvest">Robo-Advisor</TabsTrigger>
            <TabsTrigger value="etfbonds">ETF & Obligasyon</TabsTrigger>
            <TabsTrigger value="history">Istwa</TabsTrigger>
            <TabsTrigger value="education">Edikasyon</TabsTrigger>
            <TabsTrigger value="security">Sekirite</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolio" className="space-y-4">
            <PortfolioDashboard />
          </TabsContent>
          
          <TabsContent value="trade" className="space-y-4">
            <StockTrading />
          </TabsContent>
          
          <TabsContent value="watchlist" className="space-y-4">
            <Watchlist />
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            <MarketAnalysis />
          </TabsContent>
          
          <TabsContent value="autoinvest" className="space-y-4">
            <AutoInvestment />
          </TabsContent>
          
          <TabsContent value="etfbonds" className="space-y-4">
            <ETFBonds />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <TransactionHistory />
          </TabsContent>
          
          <TabsContent value="education" className="space-y-4">
            <Education />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TradingPage;
