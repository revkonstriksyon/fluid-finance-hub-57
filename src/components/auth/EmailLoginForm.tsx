import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContextType } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LogIn } from "lucide-react";

const emailFormSchema = z.object({
  email: z.string().email("Tanpri antre yon adrès imèl valid"),
  password: z.string().min(6, "Modpas dwe gen omwen 6 karaktè"),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

interface EmailLoginFormProps {
  signIn: AuthContextType['signIn'];
}

export const EmailLoginForm = ({ signIn }: EmailLoginFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: EmailFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);
      if (!error) {
        // If user is admin (hardcoded for the demo), redirect to admin page
        // In a real app, this would check a role in the auth claims or database
        if (values.email === 'admin@gmail.com' && values.password === 'admin1') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
                <Input placeholder="imel@egzanp.com" {...field} />
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
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
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
