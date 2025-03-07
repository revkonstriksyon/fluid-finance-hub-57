
import { DollarSign } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const LoginHeader = () => {
  return (
    <CardHeader className="space-y-1">
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-finance-blue/10">
          <DollarSign className="h-10 w-10 text-finance-gold" />
        </div>
      </div>
      <CardTitle className="text-2xl font-bold text-center">Konekte</CardTitle>
      <CardDescription className="text-center">
        Antre detay ou pou kontinye nan Fluid Finance
      </CardDescription>
    </CardHeader>
  );
};
