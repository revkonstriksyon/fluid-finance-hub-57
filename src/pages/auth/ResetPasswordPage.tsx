
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DollarSign, KeyRound, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email("Tanpri antre yon adrès imèl valid"),
});

type FormValues = z.infer<typeof formSchema>;

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await resetPassword(values.email);
      setSuccess(true);
    } catch (error: any) {
      console.error("Error during password reset:", error);
      setError(error.message || "Pa kapab voye imel reyinisyalizasyon. Tanpri eseye ankò.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-finance-navy p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-finance-blue/10">
              <DollarSign className="h-10 w-10 text-finance-gold" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Reyinisyalize modpas</CardTitle>
          <CardDescription className="text-center">
            Antre imèl ou pou resevwa enstriksyon pou reyinisyalize modpas ou
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success ? (
            <div className="text-center space-y-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <p className="text-green-700 dark:text-green-300">
                  Nou voye yon imel ba ou ak enstriksyon pou reyinisyalize modpas ou.
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Si ou pa resevwa imel la nan kèk minit, tcheke bwat spam ou, oswa eseye ankò.
              </p>
              <Button asChild className="w-full mt-4">
                <Link to="/auth/login">Retounen nan paj koneksyon</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imèl</FormLabel>
                      <FormControl>
                        <Input placeholder="imel@egzanp.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <span className="animate-spin mr-2">◌</span>
                      Voye demand...
                    </div>
                  ) : (
                    <>
                      <KeyRound className="mr-2 h-4 w-4" />
                      Reyinisyalize modpas
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            <Link to="/auth/login" className="text-finance-blue hover:underline">
              Retounen nan paj koneksyon
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
