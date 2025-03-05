
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { KeyRound, KeyIcon, Mail, Shield, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const emailFormSchema = z.object({
  email: z.string().email("Tanpri antre yon adrès imèl valid"),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: EmailFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await resetPassword(values.email);
      setSuccess(true);
    } catch (error: any) {
      console.error("Error during password reset:", error);
      setError(error.message || "Te gen yon erè pandan n'ap reyinisyalize modpas ou. Tanpri eseye ankò.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-[#34495e] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <KeyRound className="h-10 w-10 text-finance-blue" />
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
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Mail className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <h3 className="text-lg font-medium">Imel voye!</h3>
              <p className="text-green-700 dark:text-green-300">
                Nou voye yon imel ba ou ak enstriksyon pou reyinisyalize modpas ou.
                Tanpri tcheke bwat resepsyon ou.
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
                      <Shield className="mr-2 h-4 w-4" />
                      Voye enstriksyon reyinisyalizasyon
                    </>
                  )}
                </Button>
                
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                  <p className="mx-4 text-sm text-gray-500">OSWA</p>
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth/login" className="flex items-center justify-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retounen nan paj koneksyon
                  </Link>
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center flex-col">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Pa gen yon kont? </span>
            <Link to="/auth/register" className="text-finance-blue hover:underline">
              Kreye yon kont
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
