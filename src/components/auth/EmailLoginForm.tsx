
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const emailFormSchema = z.object({
  email: z.string().email("Tanpri antre yon adrès imèl valid"),
  password: z.string().min(6, "Modpas dwe gen omwen 6 karaktè"),
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;

interface EmailLoginFormProps {
  onSubmit: (values: EmailFormValues) => Promise<void>;
  isLoading: boolean;
}

const EmailLoginForm = ({ onSubmit, isLoading }: EmailLoginFormProps) => {
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
              <FormControl>
                <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
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

export default EmailLoginForm;
