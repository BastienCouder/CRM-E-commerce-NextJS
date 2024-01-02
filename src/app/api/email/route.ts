import { Resend } from "resend";
import { validateString } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log(resend);

export interface EmailOptions {
  to: string[];
  subject: string;
  from?: string;
  replyTo?: string;
  text?: string;
  reactComponent?: JSX.Element;
}

export async function sendMail(
  formData?: FormData,
  emailOptions?: EmailOptions
) {
  const senderEmail = formData?.get("email") ?? emailOptions?.replyTo;
  const message = formData?.get("message") ?? emailOptions?.text;

  if (!validateString(senderEmail, 500)) {
    return {
      error: "Invalid sender email",
    };
  }

  try {
    const data = await resend.emails.send({
      from: emailOptions?.from || "Acme <onboarding@resend.dev>",
      to: emailOptions?.to || ["bastien.couder@gmail.com"],
      subject: emailOptions?.subject || "Contact",
      reply_to: senderEmail as string,
      text: message as string,
      react: (emailOptions?.reactComponent as JSX.Element) || null,
    });
    console.log(data);

    return Response.json(data);
  } catch (error: unknown) {
    return Response.json({ error });
  }
}

///example
// let emailOptions = {
//   to: ["bastien.couder@gmail.com"],
//   subject: "Sujet personnalisé",
//   text: "Ceci est le corps de l'email en texte.",
//   reactComponent: <StripeWelcomeEmail />,
// };

// sendMail(undefined, emailOptions);
