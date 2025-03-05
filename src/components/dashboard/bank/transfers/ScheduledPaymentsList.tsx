
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

const ScheduledPaymentsList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Peman Pwograme</CardTitle>
        <CardDescription>Jere peman otomatik ou yo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="p-6 flex flex-col items-center justify-center h-64 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">Pa gen peman pwograme</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ou poko gen okenn peman rekiran ki pwograme. Pwograme premye ou!
            </p>
            <Button variant="outline">
              Kreye Peman Rekiran
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledPaymentsList;
