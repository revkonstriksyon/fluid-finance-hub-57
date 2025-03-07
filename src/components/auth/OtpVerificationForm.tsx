
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContextType } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const otpFormSchema = z.object({
  token: z.string().min(6, "Kòd OTP dwe gen omwen 6 chif"),
});

type OtpFormValues = z.infer<typeof otpFormSchema>;

interface OtpVerificationFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  verifyPhoneOTP: AuthContextType['verifyPhoneOTP'];
}

export const OtpVerificationForm = ({ 
  isOpen, 
  onOpenChange, 
  phoneNumber, 
  verifyPhoneOTP 
}: OtpVerificationFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = async (values: OtpFormValues) => {
    setIsLoading(true);
    try {
      const { error, user } = await verifyPhoneOTP(phoneNumber, values.token);
      if (!error && user) {
        onOpenChange(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Antre Kòd OTP</DialogTitle>
          <DialogDescription>
            Nou voye yon kòd verifikasyon nan {phoneNumber}. Tanpri antre li anba a.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kòd OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">◌</span>
                  Verifikasyon...
                </div>
              ) : (
                "Verifye"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
