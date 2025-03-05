
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { portfolioPerformanceData } from '../tradingData';

const PerformanceChart = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Pèfòmans Pòtfolyo</CardTitle>
        <CardDescription>Evolisyon valè pòtfolyo sou 12 mwa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={portfolioPerformanceData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4285F4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Valè']}
                labelFormatter={(label: any) => `${label} 2023`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4285F4"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
