
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { LoginTabs } from "@/components/auth/login/LoginTabs";
import { EmailFormValues } from "@/components/auth/login/EmailLoginForm";
import { PhoneFormValues } from "@/components/auth/login/PhoneLoginForm";
import { OtpVerificationDialog } from "@/components/auth/OtpVerificationDialog";
import { AuthCardWrapper } from "@/components/auth/AuthCardWrapper";
import { formatPhoneNumber } from "@/components/auth/utils/phoneUtils";

const LoginPage = () => {
  const { signIn, signInWithPhoneNumber, verifyPhoneOTP, signInWithGoogleAccount } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast } = useToast();

  const onEmailSubmit = async (values: EmailFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const { user, error } = await signIn(values.email, values.password);
      if (error) throw error;
      if (user) {
        console.log("Login successful, navigating to home...");
        navigate("/");
      }
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

  const onOtpSubmit = async (values: { token: string }) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const { error, user, session } = await verifyPhoneOTP(phoneNumber, values.token);
      if (!error && (user || session)) {
        setIsOtpDialogOpen(false);
        navigate("/");
      } else {
        setLoginError(error?.message || "Kòd OTP pa valid. Tanpri eseye ankò.");
      }
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

  const footerContent = (
    <>
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
    </>
  );

  return (
    <>
      <AuthCardWrapper 
        title="Konekte" 
        description="Antre detay ou pou kontinye nan Fluid Finance"
        error={loginError}
        footer={footerContent}
      >
        <LoginTabs 
          onEmailSubmit={onEmailSubmit}
          onPhoneSubmit={onPhoneSubmit}
          onGoogleSignIn={handleGoogleSignIn}
          isLoading={isLoading}
        />
      </AuthCardWrapper>
      
      <OtpVerificationDialog 
        isOpen={isOtpDialogOpen}
        onOpenChange={setIsOtpDialogOpen}
        onSubmit={onOtpSubmit}
        phoneNumber={phoneNumber}
        isLoading={isLoading}
        error={loginError}
      />
    </>
  );
};

export default LoginPage;
