
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AuthCardWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  error?: string | null;
}

export const AuthCardWrapper = ({ 
  title, 
  description, 
  children, 
  footer, 
  error 
}: AuthCardWrapperProps) => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-finance-navy p-4 overflow-y-auto">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-finance-blue/10">
              <DollarSign className="h-10 w-10 text-finance-gold" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {children}
        </CardContent>
        {footer && (
          <CardFooter className="flex justify-center flex-col space-y-4">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
