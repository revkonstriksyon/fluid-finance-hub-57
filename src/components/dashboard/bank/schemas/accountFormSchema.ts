
import { z } from "zod";

export const accountFormSchema = z.object({
  accountName: z.string().min(3, {
    message: "Non kont lan dwe gen omwen 3 karaktè.",
  }),
  accountType: z.enum(['current', 'savings', 'business', 'credit']),
  initialDeposit: z.number().min(0, {
    message: "Depo inisyal la pa kapab negatif.",
  }),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;
