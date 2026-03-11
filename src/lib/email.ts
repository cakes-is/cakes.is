import { Resend } from "resend";
import type { OrderFormData } from "./types";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }
  return new Resend(apiKey);
}

export async function sendOrderNotification(
  order: OrderFormData,
): Promise<void> {
  const recipientEmail = process.env.ORDER_EMAIL || "orders@cakes.is";

  await getResend().emails.send({
    from: "BeibíCakes <noreply@cakes.is>",
    to: [recipientEmail],
    subject: `Ný pöntun frá ${order.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #8B6F5E; border-bottom: 2px solid #D4A889; padding-bottom: 10px;">
          Ný pöntun!
        </h1>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Nafn:</td>
            <td style="padding: 8px 0;">${order.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Netfang:</td>
            <td style="padding: 8px 0;"><a href="mailto:${order.email}">${order.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Sími:</td>
            <td style="padding: 8px 0;">${order.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Dagsetning viðburðar:</td>
            <td style="padding: 8px 0;">${order.eventDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Tegund köku:</td>
            <td style="padding: 8px 0;">${order.cakeType}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background-color: #FFF8F0; border-radius: 8px;">
          <h3 style="color: #8B6F5E; margin-top: 0;">Skilaboð:</h3>
          <p style="white-space: pre-wrap;">${order.message}</p>
        </div>
      </div>
    `,
  });
}
