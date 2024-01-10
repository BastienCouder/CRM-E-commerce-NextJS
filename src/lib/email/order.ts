import { OrderItem } from "@/schemas/db-schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderEmail = async (email: string, orderItem: OrderItem) => {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: "bastien.couder@gmail.com",
    subject: "Confirm your order",
    html: `here your order`,
  });
  return orderItem;
};
