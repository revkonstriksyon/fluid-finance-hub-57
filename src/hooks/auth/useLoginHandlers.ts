
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

export type LoginHandlerOptions = {
  rememberMe: boolean;
};

export const useLoginHandlers = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { 
    signIn, 
    signInWithPhoneNumber, 
    verifyPhoneOTP, 
    signInWithGoogleAccount,
    signInWithFacebookAccount,
    signInWithAppleAccount,
    recordAuthActivity 
  } = useAuth();

  const handleEmailSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      console.log("Attempting login with email:", values.email);
      const { user, error, session } = await signIn(values.email, values.password);
      
      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      if (!user || !session) {
        console.error("Login successful but no user or session returned");
        throw new Error("Erè koneksyon. Pa gen itilizatè oswa sesyon retounen");
      }
      
      console.log("Login successful, user:", user.id);
      console.log("Session is valid:", !!session);
      
      // Record auth activity if the function exists
      if (user && recordAuthActivity) {
        await recordAuthActivity(
          user.id,
          'login',
          'Email login successful',
          undefined,
          navigator.userAgent
        );
      }
      
      // Navigate to home page
      console.log("Redirecting to home page");
      navigate("/");
    } catch (error: any) {
      console.error("Error during login:", error);
      setLoginError(error.message || "Erè koneksyon. Tanpri tcheke idantifyan ou yo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (values: { phone: string }) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const formattedPhone = values.phone;
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

  const handleOtpSubmit = async (values: { token: string }) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const { error, user } = await verifyPhoneOTP(phoneNumber, values.token);
      if (error) throw error;
      
      // Record auth activity if the function exists
      if (user && recordAuthActivity) {
        await recordAuthActivity(
          user.id,
          'login',
          'Phone login successful',
          undefined,
          navigator.userAgent
        );
      }
      
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
      console.log("Starting Google sign in process");
      const { error } = await signInWithGoogleAccount();
      if (error) {
        console.error("Google sign in error:", error);
        throw error;
      }
      console.log("Google auth initiated, redirect should happen automatically");
      // The redirect will be handled by Supabase
    } catch (error: any) {
      console.error("Error during Google sign in:", error);
      setLoginError(error.message || "Erè koneksyon Google. Tanpri eseye ankò.");
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    setLoginError(null);
    try {
      console.log("Starting Facebook sign in process");
      const { error } = await signInWithFacebookAccount();
      if (error) {
        console.error("Facebook sign in error:", error);
        throw error;
      }
      console.log("Facebook auth initiated, redirect should happen automatically");
      // The redirect will be handled by Supabase
    } catch (error: any) {
      console.error("Error during Facebook sign in:", error);
      setLoginError(error.message || "Erè koneksyon Facebook. Tanpri eseye ankò.");
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    setLoginError(null);
    try {
      console.log("Starting Apple sign in process");
      const { error } = await signInWithAppleAccount();
      if (error) {
        console.error("Apple sign in error:", error);
        throw error;
      }
      console.log("Apple auth initiated, redirect should happen automatically");
      // The redirect will be handled by Supabase
    } catch (error: any) {
      console.error("Error during Apple sign in:", error);
      setLoginError(error.message || "Erè koneksyon Apple. Tanpri eseye ankò.");
      setIsLoading(false);
    }
  };

  return {
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
  };
};
