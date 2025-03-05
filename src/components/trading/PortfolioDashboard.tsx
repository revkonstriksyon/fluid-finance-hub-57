
import PortfolioSummaryCards from './portfolio/PortfolioSummaryCards';
import ChartSection from './portfolio/ChartSection';
import HoldingsTable from './portfolio/HoldingsTable';
import PortfolioRecommendations from './portfolio/PortfolioRecommendations';

const PortfolioDashboard = () => {
  return (
    <div className="space-y-6">
      <PortfolioSummaryCards />
      <ChartSection />
      <HoldingsTable />
      <PortfolioRecommendations />
    </div>
  );
};

export default PortfolioDashboard;
