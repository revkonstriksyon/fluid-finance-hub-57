
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone } from "lucide-react";
import { EmailLoginForm, EmailFormValues } from "./EmailLoginForm";
import { PhoneLoginForm, PhoneFormValues } from "./PhoneLoginForm";
import { GoogleSignInButton } from "../GoogleSignInButton";

interface LoginTabsProps {
  onEmailSubmit: (values: EmailFormValues) => Promise<void>;
  onPhoneSubmit: (values: PhoneFormValues) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  isLoading: boolean;
}

export const LoginTabs = ({ 
  onEmailSubmit, 
  onPhoneSubmit, 
  onGoogleSignIn, 
  isLoading 
}: LoginTabsProps) => {
  return (
    <>
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
          <EmailLoginForm onSubmit={onEmailSubmit} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="phone" className="space-y-4 mt-4">
          <PhoneLoginForm onSubmit={onPhoneSubmit} isLoading={isLoading} />
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
      
      <GoogleSignInButton onClick={onGoogleSignIn} isLoading={isLoading} />
    </>
  );
};
