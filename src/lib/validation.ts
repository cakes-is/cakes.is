import { z } from "zod";

export const orderSchema = z.object({
  name: z
    .string()
    .min(2, "Nafn verður að vera að minnsta kosti 2 stafir")
    .max(100),
  email: z.string().email("Ógilt netfang"),
  phone: z.string().min(7, "Ógilt símanúmer").max(20),
  eventDate: z.string().min(1, "Vinsamlegast veldu dagsetningu"),
  cakeType: z.string().min(1, "Vinsamlegast veldu tegund köku"),
  message: z
    .string()
    .min(10, "Skilaboð verða að vera að minnsta kosti 10 stafir")
    .max(2000),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
