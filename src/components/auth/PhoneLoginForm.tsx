
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const phoneFormSchema = z.object({
  phone: z.string().min(8, "Tanpri antre yon nimewo telefòn valid"),
});

export type PhoneFormValues = z.infer<typeof phoneFormSchema>;

interface PhoneLoginFormProps {
  onSubmit: (values: PhoneFormValues) => Promise<void>;
  isLoading: boolean;
}

const PhoneLoginForm = ({ onSubmit, isLoading }: PhoneLoginFormProps) => {
  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nimewo Telefòn</FormLabel>
              <FormControl>
                <Input placeholder="+509 XXXX XXXX" autoComplete="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center">
              <span className="animate-spin mr-2">◌</span>
              Voye Kòd OTP...
            </div>
          ) : (
            <>
              <Phone className="mr-2 h-4 w-4" />
              Kontinye ak Telefòn
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PhoneLoginForm;
