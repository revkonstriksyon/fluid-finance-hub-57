import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, LogIn, Phone, Mail, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const emailFormSchema = z.object({
  email: z.string().email("Tanpri antre yon adrès imèl valid"),
  password: z.string().min(6, "Modpas dwe gen omwen 6 karaktè"),
});

const phoneFormSchema = z.object({
  phone: z.string().min(8, "Tanpri antre yon nimewo telefòn valid"),
});

const otpFormSchema = z.object({
  token: z.string().min(6, "Kòd OTP dwe gen omwen 6 chif"),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type PhoneFormValues = z.infer<typeof phoneFormSchema>;
type OtpFormValues = z.infer<typeof otpFormSchema>;

const LoginPage = () => {
  const { signIn, signInWithPhoneNumber, verifyPhoneOTP, signInWithGoogleAccount, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast } = useToast();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      token: "",
    },
  });

  const onEmailSubmit = async (values: EmailFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const { user, error } = await signIn(values.email, values.password);
      if (error) throw error;
      
      console.log("Login successful, user:", user);
      navigate("/");
    } catch (error: any) {
      console.error("Error during login:", error);
      setLoginError(error.message || "Erè koneksyon. Tanpri tcheke idantifyan ou yo.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPhoneSubmit = async (values: PhoneFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const formattedPhone = formatPhoneNumber(values.phone);
      setPhoneNumber(formattedPhone);
      const { error } = await signInWithPhoneNumber(formattedPhone);
      if (!error) {
        setIsOtpDialogOpen(true);
      } else {
        setLoginError(error.message || "Pa kapab voye kòd OTP. Tanpri eseye ankò.");
      }
    } catch (error: any) {
      console.error("Error during phone login:", error);
      setLoginError(error.message || "Erè koneksyon. Tanpri eseye ankò.");
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (values: OtpFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const { error, user, session } = await verifyPhoneOTP(phoneNumber, values.token);
      if (error) throw error;
      
      setIsOtpDialogOpen(false);
      navigate("/");
    } catch (error: any) {
      console.error("Error during OTP verification:", error);
      setLoginError(error.message || "Erè verifikasyon. Tanpri eseye ankò.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setLoginError(null);
    try {
      await signInWithGoogleAccount();
      // The redirect will be handled by Supabase
    } catch (error: any) {
      console.error("Error during Google sign in:", error);
      setLoginError(error.message || "Erè koneksyon Google. Tanpri eseye ankò.");
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Ensure it has the country code, defaulting to +509 (Haiti) if not provided
    if (!cleaned.startsWith('509') && !cleaned.startsWith('+509')) {
      cleaned = `+509${cleaned}`;
    } else if (cleaned.startsWith('509')) {
      cleaned = `+${cleaned}`;
    }
    
    return cleaned;
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
          <CardTitle className="text-2xl font-bold text-center">Konekte</CardTitle>
          <CardDescription className="text-center">
            Antre detay ou pou kontinye nan Fluid Finance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
        
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Imèl
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Telefòn
              </TabsTrigger>
            </TabsList>
            
            {/* Email Tab Content */}
            <TabsContent value="email" className="space-y-4 mt-4">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imèl</FormLabel>
                        <FormControl>
                          <Input placeholder="imel@egzanp.com" autoComplete="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modpas</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <span className="animate-spin mr-2">◌</span>
                        Koneksyon...
                      </div>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Konekte
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            {/* Phone Tab Content */}
            <TabsContent value="phone" className="space-y-4 mt-4">
              <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nimewo Telefòn</FormLabel>
                        <FormControl>
                          <Input placeholder="+509 XXXX XXXX" autoComplete="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <span className="animate-spin mr-2">◌</span>
                        Voye Kòd OTP...
                      </div>
                    ) : (
                      <>
                        <Phone className="mr-2 h-4 w-4" />
                        Kontinye ak Telefòn
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-finance-navy px-2 text-gray-500 dark:text-gray-400">
                Oswa kontinye ak
              </span>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Konekte ak Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center flex-col space-y-4">
          <div className="text-center text-sm">
            <Link to="/auth/reset-password" className="text-finance-blue hover:underline">
              Bliye modpas ou?
            </Link>
          </div>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Pa gen yon kont? </span>
            <Link to="/auth/register" className="text-finance-blue hover:underline">
              Kreye yon kont
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Antre Kòd OTP</DialogTitle>
            <DialogDescription>
              Nou voye yon kòd verifikasyon nan {phoneNumber}. Tanpri antre li anba a.
            </DialogDescription>
          </DialogHeader>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
              <FormField
                control={otpForm.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kòd OTP</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <span className="animate-spin mr-2">◌</span>
                    Verifikasyon...
                  </div>
                ) : (
                  "Verifye"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginPage;
