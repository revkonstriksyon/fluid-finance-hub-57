
import PerformanceChart from './PerformanceChart';
import AllocationChart from './AllocationChart';

const ChartSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <PerformanceChart />
      </div>
      <AllocationChart />
    </div>
  );
};

export default ChartSection;
