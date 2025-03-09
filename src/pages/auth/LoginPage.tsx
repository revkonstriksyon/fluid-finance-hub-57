
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Phone, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import our new component modules
import { EmailLoginForm } from "@/components/auth/EmailLoginForm";
import { PhoneLoginForm } from "@/components/auth/PhoneLoginForm";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginFooter } from "@/components/auth/LoginFooter";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const { signIn, signInWithPhoneNumber, verifyPhoneOTP, signInWithGoogleAccount } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handlePhoneLogin = (formattedPhone: string) => {
    setPhoneNumber(formattedPhone);
    setIsOtpDialogOpen(true);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogleAccount();
      // The redirect will be handled by Supabase
    } catch (error) {
      console.error("Error during Google sign in:", error);
      setIsLoading(false);
    }
  };

  const handleAdminDemoAccess = () => {
    navigate("/admin");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-finance-navy p-4">
      <Card className="w-full max-w-md">
        <LoginHeader />
        
        <CardContent className="space-y-4">
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
              <EmailLoginForm signIn={signIn} />
            </TabsContent>
            
            <TabsContent value="phone" className="space-y-4 mt-4">
              <PhoneLoginForm 
                signInWithPhoneNumber={signInWithPhoneNumber} 
                onOtpSent={handlePhoneLogin} 
              />
            </TabsContent>
          </Tabs>
          
          <SocialLoginButtons 
            onGoogleLogin={handleGoogleSignIn} 
            isLoading={isLoading} 
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Oubyen
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 border-dashed" 
            onClick={handleAdminDemoAccess}
          >
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            Antre nan Paj Administratè (Demo)
          </Button>
        </CardContent>
        
        <LoginFooter />
      </Card>
      
      <OtpVerificationForm 
        isOpen={isOtpDialogOpen}
        onOpenChange={setIsOtpDialogOpen}
        phoneNumber={phoneNumber}
        verifyPhoneOTP={verifyPhoneOTP}
      />
    </div>
  );
};

export default LoginPage;
