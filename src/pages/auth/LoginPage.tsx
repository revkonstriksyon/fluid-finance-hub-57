
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

// Import our components
import LoginForm from "@/components/auth/LoginForm";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";
import { useLoginHandlers } from "@/hooks/auth/useLoginHandlers";

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const {
    isLoading,
    loginError,
    phoneNumber,
    isOtpDialogOpen,
    setIsOtpDialogOpen,
    rememberMe,
    setRememberMe,
    handleEmailSubmit,
    handlePhoneSubmit,
    handleOtpSubmit,
    handleGoogleSignIn,
    handleFacebookSignIn,
    handleAppleSignIn
  } = useLoginHandlers();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      console.log("User is already logged in, redirecting to home page");
      navigate("/");
    }
  }, [user, loading, navigate]);

  console.log("LoginPage render - Auth state:", { user: !!user, loading });

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
          <LoginForm 
            isLoading={isLoading}
            loginError={loginError}
            rememberMe={rememberMe}
            onRememberMeChange={setRememberMe}
            onEmailSubmit={handleEmailSubmit}
            onPhoneSubmit={handlePhoneSubmit}
            onGoogleSignIn={handleGoogleSignIn}
            onFacebookSignIn={handleFacebookSignIn}
            onAppleSignIn={handleAppleSignIn}
          />
        </CardContent>
      </Card>
      
      <OtpVerificationForm 
        isOpen={isOtpDialogOpen}
        onOpenChange={setIsOtpDialogOpen}
        phoneNumber={phoneNumber}
        onSubmit={handleOtpSubmit}
        isLoading={isLoading}
        error={loginError}
      />
    </div>
  );
};

export default LoginPage;
