
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LogIn, Eye, EyeOff } from "lucide-react";

const emailFormSchema = z.object({
  email: z.string().email("Tanpri antre yon adrès imèl valid"),
  password: z.string().min(6, "Modpas dwe gen omwen 6 karaktè"),
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;

interface EmailLoginFormProps {
  onSubmit: (values: EmailFormValues) => Promise<void>;
  isLoading: boolean;
  rememberMe?: boolean;
  onRememberMeChange?: (value: boolean) => void;
}

const EmailLoginForm = ({ 
  onSubmit, 
  isLoading, 
  rememberMe = false, 
  onRememberMeChange 
}: EmailLoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imèl</FormLabel>
              <FormControl>
                <Input placeholder="imel@egzanp.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modpas</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    autoComplete="current-password" 
                    {...field} 
                  />
                </FormControl>
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {onRememberMeChange && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember-me" 
              checked={rememberMe} 
              onCheckedChange={(checked) => onRememberMeChange(!!checked)} 
            />
            <label 
              htmlFor="remember-me" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Kenbe mwen konekte
            </label>
          </div>
        )}
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center">
              <span className="animate-spin mr-2">◌</span>
              Koneksyon...
            </div>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Konekte
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EmailLoginForm;
