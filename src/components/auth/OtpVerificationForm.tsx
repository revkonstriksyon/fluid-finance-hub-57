
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ShieldCheck } from "lucide-react";

const otpFormSchema = z.object({
  token: z
    .string()
    .min(6, "Kòd OTP dwe gen omwen 6 chif")
    .max(6, "Kòd OTP pa dwe depase 6 chif")
    .regex(/^\d+$/, "Kòd OTP dwe gen sèlman chif"),
});

export type OtpFormValues = z.infer<typeof otpFormSchema>;

interface OtpVerificationFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  onSubmit: (values: OtpFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const OtpVerificationForm = ({ 
  isOpen, 
  onOpenChange, 
  phoneNumber, 
  onSubmit, 
  isLoading, 
  error 
}: OtpVerificationFormProps) => {
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      token: "",
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <ShieldCheck className="h-6 w-6 mb-2 text-finance-blue mx-auto" />
          <DialogTitle className="text-center">Antre Kòd OTP</DialogTitle>
          <DialogDescription className="text-center">
            Nou voye yon kòd verifikasyon nan {phoneNumber}. Tanpri antre li anba a.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kòd OTP</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123456" 
                      {...field} 
                      inputMode="numeric" 
                      maxLength={6} 
                      className="text-center text-lg" 
                      autoComplete="one-time-code"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">Anile</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                {isLoading ? (
                  <div className="flex items-center">
                    <span className="animate-spin mr-2">◌</span>
                    Verifikasyon...
                  </div>
                ) : (
                  "Verifye"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationForm;
