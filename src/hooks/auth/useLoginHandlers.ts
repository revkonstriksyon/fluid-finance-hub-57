
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { EmailFormValues } from "@/components/auth/EmailLoginForm";
import { PhoneFormValues } from "@/components/auth/PhoneFormValues";
import { useEmailAuth } from "./useEmailAuth";
import { usePhoneAuth } from "./usePhoneAuth";
import { useSocialAuth } from "./useSocialAuth";

export const useLoginHandlers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  
  const { signIn } = useEmailAuth();
  const { signInWithPhoneNumber, verifyPhoneOTP } = usePhoneAuth();
  const { signInWithGoogleAccount, signInWithFacebookAccount, signInWithAppleAccount } = useSocialAuth();

  const handleEmailSubmit = async (values: EmailFormValues) => {
    console.log("Attempting email login with:", values.email);
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        console.error("Email login error:", error);
        setLoginError(error.message || "Pa kapab konekte. Tanpri verifye imèl ou ak modpas ou.");
      } else {
        console.log("Email login successful, redirecting to home");
        // Successful login, navigate to home page
        navigate("/");
      }
    } catch (error: any) {
      console.error("Unexpected email login error:", error);
      setLoginError(error.message || "Pa kapab konekte. Yon erè te rive.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (values: PhoneFormValues) => {
    console.log("Attempting phone login with:", values.phone);
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Clean up and format the phone number
      const formattedPhone = formatPhoneNumber(values.phone);
      setPhoneNumber(formattedPhone);
      
      const { error } = await signInWithPhoneNumber(formattedPhone);
      
      if (error) {
        console.error("Phone login error:", error);
        setLoginError(error.message || "Pa kapab voye kòd OTP. Tanpri verifye nimewo telefòn ou.");
      } else {
        // Show OTP verification dialog
        setIsOtpDialogOpen(true);
      }
    } catch (error: any) {
      console.error("Unexpected phone login error:", error);
      setLoginError(error.message || "Pa kapab konekte. Yon erè te rive.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    console.log("Verifying OTP for phone:", phoneNumber);
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const { error, user } = await verifyPhoneOTP(phoneNumber, otp);
      
      if (error) {
        console.error("OTP verification error:", error);
        setLoginError(error.message || "Kòd OTP ou antre a pa valid. Tanpri eseye ankò.");
      } else {
        console.log("OTP verification successful, user:", user?.id);
        // Close OTP dialog
        setIsOtpDialogOpen(false);
        
        // Navigate to home page
        console.log("Navigating to home page after successful OTP verification");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Unexpected OTP verification error:", error);
      setLoginError(error.message || "Pa kapab verifye kòd OTP. Yon erè te rive.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log("Attempting Google login");
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const { error } = await signInWithGoogleAccount();
      
      if (error) {
        console.error("Google login error:", error);
        setLoginError(error.message || "Pa kapab konekte ak Google. Tanpri eseye ankò.");
        setIsLoading(false); // Only set loading to false here if there's an error
      }
      // If successful, Supabase will redirect the user
    } catch (error: any) {
      console.error("Unexpected Google login error:", error);
      setLoginError(error.message || "Pa kapab konekte. Yon erè te rive.");
      setIsLoading(false);
    }
    // Note: we don't set isLoading to false on success because we're redirecting
  };

  const handleFacebookSignIn = async () => {
    console.log("Attempting Facebook login");
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const { error } = await signInWithFacebookAccount();
      
      if (error) {
        console.error("Facebook login error:", error);
        setLoginError(error.message || "Pa kapab konekte ak Facebook. Tanpri eseye ankò.");
        setIsLoading(false);
      }
      // If successful, Supabase will redirect the user
    } catch (error: any) {
      console.error("Unexpected Facebook login error:", error);
      setLoginError(error.message || "Pa kapab konekte. Yon erè te rive.");
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    console.log("Attempting Apple login");
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const { error } = await signInWithAppleAccount();
      
      if (error) {
        console.error("Apple login error:", error);
        setLoginError(error.message || "Pa kapab konekte ak Apple. Tanpri eseye ankò.");
        setIsLoading(false);
      }
      // If successful, Supabase will redirect the user
    } catch (error: any) {
      console.error("Unexpected Apple login error:", error);
      setLoginError(error.message || "Pa kapab konekte. Yon erè te rive.");
      setIsLoading(false);
    }
  };

  // Helper function to format phone number
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
