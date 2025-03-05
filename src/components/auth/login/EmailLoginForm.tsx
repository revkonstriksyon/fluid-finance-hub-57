
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LogIn, Eye, EyeOff } from "lucide-react";

const emailFormSchema = z.object({
  email: z.string().email("Tanpri antre yon adrès imèl valid"),
  password: z.string().min(6, "Modpas dwe gen omwen 6 karaktè"),
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;

interface EmailLoginFormProps {
  onSubmit: (values: EmailFormValues) => Promise<void>;
  isLoading: boolean;
}

export const EmailLoginForm = ({ onSubmit, isLoading }: EmailLoginFormProps) => {
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
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
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
