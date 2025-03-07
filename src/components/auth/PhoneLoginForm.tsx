
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContextType } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Phone } from "lucide-react";

const phoneFormSchema = z.object({
  phone: z.string().min(8, "Tanpri antre yon nimewo telefòn valid"),
});

type PhoneFormValues = z.infer<typeof phoneFormSchema>;

interface PhoneLoginFormProps {
  signInWithPhoneNumber: AuthContextType['signInWithPhoneNumber'];
  onOtpSent: (phoneNumber: string) => void;
}

export const PhoneLoginForm = ({ signInWithPhoneNumber, onOtpSent }: PhoneLoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (values: PhoneFormValues) => {
    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(values.phone);
      const { error } = await signInWithPhoneNumber(formattedPhone);
      if (!error) {
        onOtpSent(formattedPhone);
      }
    } catch (error) {
      console.error("Error during phone login:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
                <Input placeholder="+509 XXXX XXXX" {...field} />
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
