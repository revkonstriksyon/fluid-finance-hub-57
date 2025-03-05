
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import PasswordGenerator from "@/components/auth/PasswordGenerator";
import { validatePasswordStrength } from "@/utils/passwordUtils";

const emailFormSchema = z.object({
  name: z.string().min(2, "Non dwe gen omwen 2 karaktè"),
  email: z.string().email("Tanpri antre yon adrès imèl valid"),
  password: z.string().refine(
    (password) => validatePasswordStrength(password).isValid,
    {
      message: "Modpas la dwe gen omwen 8 karaktè, yon lèt majiskil, yon chif, ak yon karaktè espesyal",
    }
  ),
  confirmPassword: z.string().min(6, "Modpas dwe gen omwen 6 karaktè"),
  location: z.string().optional(),
  bio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Modpas yo pa menm",
  path: ["confirmPassword"],
});

export type EmailRegisterFormValues = z.infer<typeof emailFormSchema>;

interface EmailRegisterFormProps {
  onSubmit: (values: EmailRegisterFormValues) => Promise<void>;
  isLoading: boolean;
}

export const EmailRegisterForm = ({ onSubmit, isLoading }: EmailRegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<EmailRegisterFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      bio: "",
    },
  });

  const handlePasswordGeneration = (password: string) => {
    form.setValue("password", password);
    form.setValue("confirmPassword", password);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Non konplè</FormLabel>
              <FormControl>
                <Input placeholder="Jan Batis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imèl</FormLabel>
              <FormControl>
                <Input placeholder="imel@egzanp.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasyon</FormLabel>
              <FormControl>
                <Input placeholder="Pòtoprens, Ayiti" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Byografi</FormLabel>
              <FormControl>
                <Input placeholder="Kèk mo sou ou..." {...field} />
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
                  <div className="flex">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      {...field} 
                      className="pr-20"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center mr-11">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-full px-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <PasswordGenerator 
                        onPasswordGenerated={handlePasswordGeneration}
                        className="h-full mr-2"
                      />
                    </div>
                  </div>
                </FormControl>
              </div>
              <PasswordStrengthMeter password={field.value} className="mt-2" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfime Modpas</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    {...field} 
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-full"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              Kreyasyon kont...
            </div>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Kreye kont
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
