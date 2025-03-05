
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Phone, Mail } from "lucide-react";

// Import our focused components
import EmailLoginForm from "@/components/auth/EmailLoginForm";
import PhoneLoginForm from "@/components/auth/PhoneLoginForm";
import SocialLoginOptions from "@/components/auth/SocialLoginOptions";
import { EmailFormValues } from "@/components/auth/EmailLoginForm";
import { PhoneFormValues } from "@/components/auth/PhoneFormValues";

interface LoginFormProps {
  isLoading: boolean;
  loginError: string | null;
  rememberMe: boolean;
  onRememberMeChange: (value: boolean) => void;
  onEmailSubmit: (values: EmailFormValues) => Promise<void>;
  onPhoneSubmit: (values: PhoneFormValues) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  onFacebookSignIn: () => Promise<void>;
  onAppleSignIn: () => Promise<void>;
}

const LoginForm = ({
  isLoading,
  loginError,
  rememberMe,
  onRememberMeChange,
  onEmailSubmit,
  onPhoneSubmit,
  onGoogleSignIn,
  onFacebookSignIn,
  onAppleSignIn
}: LoginFormProps) => {
  return (
    <div className="space-y-4">
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
            rememberMe={rememberMe}
            onRememberMeChange={onRememberMeChange}
          />
        </TabsContent>
        
        {/* Phone Tab Content */}
        <TabsContent value="phone" className="space-y-4 mt-4">
          <PhoneLoginForm 
            onSubmit={onPhoneSubmit} 
            isLoading={isLoading} 
            rememberMe={rememberMe}
            onRememberMeChange={onRememberMeChange}
          />
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
      
      <SocialLoginOptions 
        onGoogleSignIn={onGoogleSignIn}
        onFacebookSignIn={onFacebookSignIn}
        onAppleSignIn={onAppleSignIn}
        isLoading={isLoading} 
      />

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
    </div>
  );
};

export default LoginForm;
