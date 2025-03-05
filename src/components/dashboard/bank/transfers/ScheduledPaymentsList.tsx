
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';

const ScheduledPaymentsList = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Peman Pwograme</CardTitle>
        <CardDescription>Jere peman otomatik ou yo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-finance-lightGray/50 dark:bg-white/5 rounded-lg">
          <div className="p-6 flex flex-col items-center justify-center h-64 text-center">
            <div className="bg-finance-blue/10 dark:bg-finance-blue/20 p-3 rounded-full mb-4">
              <Clock className="h-6 w-6 text-finance-blue dark:text-finance-lightBlue" />
            </div>
            <h3 className="font-medium text-lg mb-2">Pa gen peman pwograme</h3>
            <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-4">
              Ou poko gen okenn peman rekiran ki pwograme. Pwograme premye ou!
            </p>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-finance-blue/10 text-finance-blue dark:bg-finance-blue/20 dark:text-finance-lightBlue border-finance-blue/20 hover:bg-finance-blue/20 dark:hover:bg-finance-blue/30"
            >
              <Plus className="h-4 w-4" />
              Kreye Peman Rekiran
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledPaymentsList;
