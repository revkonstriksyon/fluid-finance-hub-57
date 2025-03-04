
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const AutoInvestment = () => {
  const [riskLevel, setRiskLevel] = useState(5);
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [investmentFrequency, setInvestmentFrequency] = useState("monthly");
  
  // Sample portfolio allocation based on risk level
  const getAllocation = () => {
    // More stocks for higher risk, more bonds for lower risk
    let stocks = 30 + (riskLevel * 5);
    let bonds = Math.max(0, 50 - (riskLevel * 4));
    let cash = Math.max(0, 20 - (riskLevel * 1));
    let alternatives = 100 - stocks - bonds - cash;
    
    return [
      { name: "Aksyon", value: stocks, color: "#4285F4" },
      { name: "Obligasyon", value: bonds, color: "#34A853" },
      { name: "Kach", value: cash, color: "#FBBC05" },
      { name: "Altènatif", value: alternatives, color: "#EA4335" }
    ];
  };
  
  const allocation = getAllocation();
  
  const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Robo-Advisor</CardTitle>
          <CardDescription>Fè konpitè a jere envestisman ou yo otomatikman</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nivo Risk</label>
            <div className="flex items-center gap-4">
              <span className="text-sm">Konsevasyon</span>
              <Slider
                value={[riskLevel]} 
                min={1} 
                max={10}
                step={1}
                onValueChange={(value) => setRiskLevel(value[0])}
                className="flex-1"
              />
              <span className="text-sm">Agresif</span>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {riskLevel}/10
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Montan Envestisman</label>
            <div className="flex items-center gap-4">
              <span className="text-sm">$100</span>
              <Slider
                value={[investmentAmount]} 
                min={100} 
                max={10000}
                step={100}
                onValueChange={(value) => setInvestmentAmount(value[0])}
                className="flex-1"
              />
              <span className="text-sm">$10,000</span>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              ${investmentAmount.toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Frekans Envestisman</label>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={investmentFrequency === "weekly" ? "default" : "outline"}
                onClick={() => setInvestmentFrequency("weekly")}
              >
                Chak Semèn
              </Button>
              <Button 
                variant={investmentFrequency === "biweekly" ? "default" : "outline"}
                onClick={() => setInvestmentFrequency("biweekly")}
              >
                Chak 2 Semèn
              </Button>
              <Button 
                variant={investmentFrequency === "monthly" ? "default" : "outline"}
                onClick={() => setInvestmentFrequency("monthly")}
              >
                Chak Mwa
              </Button>
            </div>
          </div>
          
          <Button className="w-full">Aktive Envestisman Otomatik</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Alokasyon Rekòmande</CardTitle>
          <CardDescription>Selon nivo risk ou chwazi a</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {allocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4 mt-4">
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Prediksyon Pèfòmans Anyèl</div>
                <div className="text-right text-sm">+{4 + riskLevel * 0.5}% a +{7 + riskLevel * 1}%</div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Risk Volatilite</div>
                <div className="text-right text-sm">{riskLevel <= 3 ? 'Ba' : riskLevel <= 7 ? 'Mwayen' : 'Wo'}</div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Orizon Envestisman Rekòmande</div>
                <div className="text-right text-sm">{riskLevel <= 3 ? '1-3 ane' : riskLevel <= 7 ? '3-7 ane' : '7+ ane'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Karakteristik Pòtfolyo</CardTitle>
          <CardDescription>Done detaye sou pòtfolyo Robo-Advisor a</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Top Envestisman</h4>
              <ul className="space-y-1">
                <li className="text-sm flex justify-between">
                  <span>VTI (Total US Stock Market)</span>
                  <span>{allocation[0].value * 0.4}%</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>VXUS (Total Intl Stock)</span>
                  <span>{allocation[0].value * 0.3}%</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>BND (Total US Bond)</span>
                  <span>{allocation[1].value * 0.6}%</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>BNDX (Total Intl Bond)</span>
                  <span>{allocation[1].value * 0.4}%</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>VTIP (TIPS)</span>
                  <span>{allocation[3].value * 0.5}%</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Alokasyon Jewografik</h4>
              <ul className="space-y-1">
                <li className="text-sm flex justify-between">
                  <span>Etazini</span>
                  <span>60%</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>Entènasyonal Devlope</span>
                  <span>25%</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>Mache Emerjan</span>
                  <span>15%</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Frè ak Depans</h4>
              <ul className="space-y-1">
                <li className="text-sm flex justify-between">
                  <span>Frè Jesyon Anyèl</span>
                  <span>0.25%</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>Frè ETF Mwayen</span>
                  <span>0.08%</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span>Total Frè Anyèl</span>
                  <span>0.33%</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoInvestment;
