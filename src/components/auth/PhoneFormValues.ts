
import { z } from "zod";

export const phoneFormSchema = z.object({
  phone: z.string().min(8, "Tanpri antre yon nimewo telefòn valid"),
});

export type PhoneFormValues = z.infer<typeof phoneFormSchema>;
