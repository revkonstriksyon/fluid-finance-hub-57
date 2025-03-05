
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const otpFormSchema = z.object({
  token: z.string().min(6, "Kòd OTP dwe gen omwen 6 chif"),
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Antre Kòd OTP</DialogTitle>
          <DialogDescription>
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

export default OtpVerificationForm;
