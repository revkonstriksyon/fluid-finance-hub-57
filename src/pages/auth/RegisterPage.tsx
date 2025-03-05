
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
import { DollarSign, UserPlus, Phone, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import PasswordGenerator from "@/components/auth/PasswordGenerator";
import { validatePasswordStrength } from "@/utils/passwordUtils";

const emailFormSchema = z.object({
  name: z.string().min(2, "Non dwe gen omwen 2 karaktè"),
  email: z.string().email("Tanpri antre yon adrès imèl valid"),
  password: z.string().refine(
    (password) => validatePasswordStrength(password).isValid,
    {
      message: "Modpas la dwe gen omwen 8 karaktè, yon lèt majiskil, yon chif, ak yon karaktè espesyal",
    }
  ),
  confirmPassword: z.string().min(6, "Modpas dwe gen omwen 6 karaktè"),
  location: z.string().optional(),
  bio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Modpas yo pa menm",
  path: ["confirmPassword"],
});

const phoneFormSchema = z.object({
  name: z.string().min(2, "Non dwe gen omwen 2 karaktè"),
  phone: z.string().min(8, "Tanpri antre yon nimewo telefòn valid"),
  location: z.string().optional(),
  bio: z.string().optional(),
});

const otpFormSchema = z.object({
  token: z.string().min(6, "Kòd OTP dwe gen omwen 6 chif"),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type PhoneFormValues = z.infer<typeof phoneFormSchema>;
type OtpFormValues = z.infer<typeof otpFormSchema>;

const RegisterPage = () => {
  const { signUp, signInWithPhoneNumber, verifyPhoneOTP, signInWithGoogleAccount } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [userBio, setUserBio] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      bio: "",
    },
  });

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      bio: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      token: "",
    },
  });

  // Reset error when tab changes
  useEffect(() => {
    setRegisterError(null);
  }, [emailForm.formState.isSubmitSuccessful, phoneForm.formState.isSubmitSuccessful]);

  const onEmailSubmit = async (values: EmailFormValues) => {
    setIsLoading(true);
    setRegisterError(null);
    
    try {
      await signUp(values.email, values.password, values.name);
      
      // After signup is successful, add additional profile information
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData?.user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            location: values.location || null,
            bio: values.bio || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userData.user.id);
          
        if (error) {
          console.error("Error updating profile information:", error);
          toast({
            title: "Erè",
            description: "Te gen yon erè pandan n'ap mete ajou pwofil ou.",
            variant: "destructive"
          });
        }
      }
      
      toast({
        title: "Kont kreye",
        description: "Ou kapab konekte kounye a avèk nouvo kont ou.",
      });
      
      navigate("/auth/login");
    } catch (error: any) {
      console.error("Error during registration:", error);
      setRegisterError(error.message || "Te gen yon erè pandan n'ap kreye kont ou. Tanpri eseye ankò.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPhoneSubmit = async (values: PhoneFormValues) => {
    setIsLoading(true);
    setRegisterError(null);
    
    try {
      const formattedPhone = formatPhoneNumber(values.phone);
      setPhoneNumber(formattedPhone);
      setUserName(values.name);
      setUserLocation(values.location || "");
      setUserBio(values.bio || "");
      
      const { error } = await signInWithPhoneNumber(formattedPhone);
      if (!error) {
        setIsOtpDialogOpen(true);
        toast({
          title: "Kòd OTP voye",
          description: "Tanpri tcheke telefòn ou pou kòd verifikasyon an.",
        });
      } else {
        setRegisterError(error.message || "Te gen yon erè pandan n'ap voye kòd OTP a. Tanpri eseye ankò.");
      }
    } catch (error: any) {
      console.error("Error during phone registration:", error);
      setRegisterError(error.message || "Te gen yon erè pandan n'ap enskri ou. Tanpri eseye ankò.");
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (values: OtpFormValues) => {
    setIsLoading(true);
    setRegisterError(null);
    
    try {
      const { error, user } = await verifyPhoneOTP(phoneNumber, values.token);
      if (!error && user) {
        // Update user profile with name, location, and bio after OTP verification
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: user.id,
              phone: phoneNumber,
              full_name: userName,
              username: phoneNumber.replace(/\D/g, ''),
              location: userLocation,
              bio: userBio,
              updated_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error("Error updating profile:", profileError);
          toast({
            title: "Erè",
            description: "Te gen yon erè pandan n'ap mete ajou pwofil ou.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Verifikasyon reyisi",
            description: "Kont ou kreye ak siksè!",
          });
        }

        setIsOtpDialogOpen(false);
        navigate("/");
      } else {
        setRegisterError(error?.message || "Kòd OTP ou antre a pa valid. Tanpri eseye ankò.");
      }
    } catch (error: any) {
      console.error("Error during OTP verification:", error);
      setRegisterError(error.message || "Te gen yon erè pandan n'ap verifye kòd OTP a. Tanpri eseye ankò.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setRegisterError(null);
    
    try {
      await signInWithGoogleAccount();
      // The redirect will be handled by Supabase
    } catch (error: any) {
      console.error("Error during Google sign in:", error);
      setRegisterError(error.message || "Te gen yon erè pandan n'ap konekte ak Google. Tanpri eseye ankò.");
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

  const handlePasswordGeneration = (password: string) => {
    emailForm.setValue("password", password);
    emailForm.setValue("confirmPassword", password);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-finance-navy p-4 overflow-y-auto">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-finance-blue/10">
              <DollarSign className="h-10 w-10 text-finance-gold" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Kreye yon kont</CardTitle>
          <CardDescription className="text-center">
            Antre enfòmasyon ou pou kreye yon kont nan Fluid Finance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {registerError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{registerError}</AlertDescription>
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
            
            <TabsContent value="email" className="space-y-4 mt-4">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Non konplè</FormLabel>
                        <FormControl>
                          <Input placeholder="Jan Batis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
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
                  <FormField
                    control={emailForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lokasyon</FormLabel>
                        <FormControl>
                          <Input placeholder="Pòtoprens, Ayiti" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Byografi</FormLabel>
                        <FormControl>
                          <Input placeholder="Kèk mo sou ou..." {...field} />
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
                        <div className="relative">
                          <FormControl>
                            <div className="flex">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
                                className="pr-20"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center mr-11">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-full px-2"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                              <div className="absolute inset-y-0 right-0 flex items-center">
                                <PasswordGenerator 
                                  onPasswordGenerated={handlePasswordGeneration}
                                  className="h-full mr-2"
                                />
                              </div>
                            </div>
                          </FormControl>
                        </div>
                        <PasswordStrengthMeter password={field.value} className="mt-2" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfime Modpas</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              {...field} 
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-full"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <span className="animate-spin mr-2">◌</span>
                        Kreyasyon kont...
                      </div>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Kreye kont
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="phone" className="space-y-4 mt-4">
              <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                  <FormField
                    control={phoneForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Non konplè</FormLabel>
                        <FormControl>
                          <Input placeholder="Jan Batis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nimewo Telefòn</FormLabel>
                        <FormControl>
                          <Input placeholder="+509 XXXX XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={phoneForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lokasyon</FormLabel>
                        <FormControl>
                          <Input placeholder="Pòtoprens, Ayiti" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={phoneForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Byografi</FormLabel>
                        <FormControl>
                          <Input placeholder="Kèk mo sou ou..." {...field} />
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
            Kreye kont ak Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Ou gentan gen yon kont? </span>
            <Link to="/auth/login" className="text-finance-blue hover:underline">
              Konekte
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
          {registerError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{registerError}</AlertDescription>
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

export default RegisterPage;
