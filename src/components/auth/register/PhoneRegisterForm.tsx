
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Phone } from "lucide-react";

const phoneFormSchema = z.object({
  name: z.string().min(2, "Non dwe gen omwen 2 karaktè"),
  phone: z.string().min(8, "Tanpri antre yon nimewo telefòn valid"),
  location: z.string().optional(),
  bio: z.string().optional(),
});

export type PhoneRegisterFormValues = z.infer<typeof phoneFormSchema>;

interface PhoneRegisterFormProps {
  onSubmit: (values: PhoneRegisterFormValues) => Promise<void>;
  isLoading: boolean;
}

export const PhoneRegisterForm = ({ onSubmit, isLoading }: PhoneRegisterFormProps) => {
  const form = useForm<PhoneRegisterFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      bio: "",
    },
  });

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
