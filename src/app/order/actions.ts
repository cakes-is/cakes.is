"use server";

import { appendOrder } from "@/lib/sheets";
import { sendOrderNotification } from "@/lib/email";
import { orderSchema } from "@/lib/validation";

export type OrderActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string }
  | { status: "validation_error"; errors: Record<string, string[]> };

export async function submitOrder(
  _prevState: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    eventDate: formData.get("eventDate") as string,
    cakeType: formData.get("cakeType") as string,
    message: formData.get("message") as string,
  };

  const result = orderSchema.safeParse(raw);

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    for (const [field, issues] of Object.entries(
      result.error.flatten().fieldErrors,
    )) {
      if (issues) errors[field] = issues;
    }
    return { status: "validation_error", errors };
  }

  const data = result.data;

  try {
    await Promise.all([
      appendOrder({
        date: new Date().toISOString().split("T")[0],
        name: data.name,
        email: data.email,
        phone: data.phone,
        event_date: data.eventDate,
        cake_type: data.cakeType,
        message: data.message,
        status: "Ný",
      }),
      sendOrderNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventDate: data.eventDate,
        cakeType: data.cakeType,
        message: data.message,
      }),
    ]);

    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "Eitthvað fór úrskeiðis. Vinsamlegast reyndu aftur eða hafðu samband við okkur beint á orders@cakes.is.",
    };
  }
}
