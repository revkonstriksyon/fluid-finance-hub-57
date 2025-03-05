
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, Phone, Mail, AlertCircle } from "lucide-react";
import { formatPhoneNumber } from "@/utils/phoneUtils";

// Import our new components
import EmailLoginForm, { EmailFormValues } from "@/components/auth/EmailLoginForm";
import PhoneLoginForm, { PhoneFormValues } from "@/components/auth/PhoneLoginForm";
import OtpVerificationForm, { OtpFormValues } from "@/components/auth/OtpVerificationForm";
import SocialLoginOptions from "@/components/auth/SocialLoginOptions";

const LoginPage = () => {
  const { signIn, signInWithPhoneNumber, verifyPhoneOTP, signInWithGoogleAccount, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

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
      const { error } = await verifyPhoneOTP(phoneNumber, values.token);
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
            Antre detay ou pou kontinye nan EBOUS
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
              <EmailLoginForm 
                onSubmit={onEmailSubmit} 
                isLoading={isLoading} 
              />
            </TabsContent>
            
            {/* Phone Tab Content */}
            <TabsContent value="phone" className="space-y-4 mt-4">
              <PhoneLoginForm 
                onSubmit={onPhoneSubmit} 
                isLoading={isLoading} 
              />
            </TabsContent>
          </Tabs>
          
          <SocialLoginOptions 
            onGoogleSignIn={handleGoogleSignIn} 
            isLoading={isLoading} 
          />
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
      
      <OtpVerificationForm 
        isOpen={isOtpDialogOpen}
        onOpenChange={setIsOtpDialogOpen}
        phoneNumber={phoneNumber}
        onSubmit={onOtpSubmit}
        isLoading={isLoading}
        error={loginError}
      />
    </div>
  );
};

export default LoginPage;
