
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Key, CheckCheck, EyeIcon, EyeOffIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const passwordFormSchema = z.object({
  password: z
    .string()
    .min(8, "Modpas la dwe gen omwen 8 karaktè")
    .regex(/[A-Z]/, "Modpas la dwe gen omwen yon lèt majiskil")
    .regex(/[0-9]/, "Modpas la dwe gen omwen yon chif")
    .regex(/[^a-zA-Z0-9]/, "Modpas la dwe gen omwen yon karaktè espesyal"),
  confirmPassword: z.string().min(1, "Tanpri konfime modpas ou"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Modpas yo pa menm",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const SetNewPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Extraire le token et l'email des paramètres d'URL
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setTokenError("Lyen reyinisyalizasyon modpas la pa valid oswa li ekspire.");
    }
  }, [token, email]);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    if (!token || !email) {
      setTokenError("Lyen reyinisyalizasyon modpas la pa valid oswa li ekspire.");
      return;
    }

    setIsLoading(true);
    try {
      // Utilisation de l'API Supabase pour réinitialiser le mot de passe
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Modpas Mete Ajou",
        description: "Modpas ou te mete ajou avèk siksè. Ou kapab konekte kounye a.",
      });
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Erè",
        description: error.message || "Pa kapab mete ajou modpas. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Vérification des exigences de mot de passe
  const password = form.watch("password");
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-[#34495e] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Key className="h-10 w-10 text-finance-blue" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Kreye Nouvo Modpas</CardTitle>
          <CardDescription className="text-center">
            Antre nouvo modpas ou pou kont ou
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tokenError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{tokenError}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCheck className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <h3 className="text-lg font-medium">Modpas Mete Ajou!</h3>
              <p className="text-green-700 dark:text-green-300">
                Modpas ou te mete ajou avèk siksè. W'ap redirije nan paj koneksyon...
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouvo Modpas</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Antre nouvo modpas" 
                            {...field} 
                          />
                        </FormControl>
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Exigences de mot de passe */}
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Modpas la dwe genyen:</p>
                  <ul className="space-y-1">
                    <li className={`flex items-center ${hasMinLength ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-2">{hasMinLength ? '✓' : '○'}</span>
                      Omwen 8 karaktè
                    </li>
                    <li className={`flex items-center ${hasUpperCase ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-2">{hasUpperCase ? '✓' : '○'}</span>
                      Omwen yon lèt majiskil (A-Z)
                    </li>
                    <li className={`flex items-center ${hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-2">{hasNumber ? '✓' : '○'}</span>
                      Omwen yon chif (0-9)
                    </li>
                    <li className={`flex items-center ${hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-2">{hasSpecialChar ? '✓' : '○'}</span>
                      Omwen yon karaktè espesyal (@, $, !, etc.)
                    </li>
                  </ul>
                </div>

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfime Nouvo Modpas</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Konfime nouvo modpas" 
                            {...field} 
                          />
                        </FormControl>
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading || !form.formState.isValid}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <span className="animate-spin mr-2">◌</span>
                      Mizajou modpas...
                    </div>
                  ) : (
                    "Mete ajou modpas"
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

export default SetNewPasswordPage;
