
import { CheckCircle, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const PortfolioRecommendations = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reyisit ak Sijesyon</CardTitle>
        <CardDescription>Rekòmandasyon pou amelyore pòtfolyo ou</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Divèsifikasyon solid</h4>
              <p className="text-sm text-muted-foreground">Pòtfolyo ou gen yon bon melanj aksyon, obligasyon, ak lajan kach.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Sektè teknoloji domine</h4>
              <p className="text-sm text-muted-foreground">Konsidere ajoute aksyon nan lòt sektè tankou sante, enèji, oswa finans pou pi bon divèsifikasyon.</p>
              <div className="mt-2">
                <div className="text-xs mb-1 flex justify-between">
                  <span>Ekspozisyon nan teknoloji</span>
                  <span>72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Okenn pozisyon entènasyonal</h4>
              <p className="text-sm text-muted-foreground">Konsidere ajoute ETF entènasyonal tankou VEA oswa VXUS pou ekspozisyon global.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioRecommendations;
