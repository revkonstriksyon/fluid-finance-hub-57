
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const otpFormSchema = z.object({
  token: z.string().min(6, "Kòd OTP dwe gen omwen 6 chif"),
});

type OtpFormValues = z.infer<typeof otpFormSchema>;

interface OtpVerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: OtpFormValues) => Promise<void>;
  phoneNumber: string;
  isLoading: boolean;
  error: string | null;
}

export const OtpVerificationDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  phoneNumber, 
  isLoading, 
  error 
}: OtpVerificationDialogProps) => {
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      token: "",
    },
  });

  const handleSubmit = async (values: OtpFormValues) => {
    await onSubmit(values);
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={otpForm.control}
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
