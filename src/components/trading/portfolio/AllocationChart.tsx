
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { portfolioAllocationData } from '../tradingData';

const AllocationChart = () => {
  // Colors for pie chart
  const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Alokasyon Aktif</CardTitle>
        <CardDescription>Distribisyon pòtfolyo pa klas aktif</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-56 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={portfolioAllocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {portfolioAllocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllocationChart;
