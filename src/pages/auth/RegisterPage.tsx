
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { RegisterTabs } from "@/components/auth/register/RegisterTabs";
import { EmailRegisterFormValues } from "@/components/auth/register/EmailRegisterForm";
import { PhoneRegisterFormValues } from "@/components/auth/register/PhoneRegisterForm";
import { OtpVerificationDialog } from "@/components/auth/OtpVerificationDialog";
import { AuthCardWrapper } from "@/components/auth/AuthCardWrapper";
import { formatPhoneNumber } from "@/components/auth/utils/phoneUtils";

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
  const { toast } = useToast();

  // Reset error when tab changes
  useEffect(() => {
    setRegisterError(null);
  }, []);

  const onEmailSubmit = async (values: EmailRegisterFormValues) => {
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

  const onPhoneSubmit = async (values: PhoneRegisterFormValues) => {
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

  const onOtpSubmit = async (values: { token: string }) => {
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

  const footerContent = (
    <div className="text-center text-sm">
      <span className="text-muted-foreground">Ou gentan gen yon kont? </span>
      <Link to="/auth/login" className="text-finance-blue hover:underline">
        Konekte
      </Link>
    </div>
  );

  return (
    <>
      <AuthCardWrapper 
        title="Kreye yon kont" 
        description="Antre enfòmasyon ou pou kreye yon kont nan Fluid Finance"
        error={registerError}
        footer={footerContent}
      >
        <RegisterTabs 
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
        error={registerError}
      />
    </>
  );
};

export default RegisterPage;
