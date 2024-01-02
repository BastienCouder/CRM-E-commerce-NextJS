import { revalidatePath } from "next/cache";
import { env } from "../env";
import { sendMail } from "@/app/api/email/route";
import { auth } from "@/auth";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = env.NEXTAUTH_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  let emailOptions = {
    to: [email],
    subject: "2FA Code",
    text: `Ceci est le corps de l'email en texte. Your 2FA code: ${token}`,
  };

  sendMail(undefined, emailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;
  let emailOptions = {
    to: [email],
    subject: "Reset your password",
    text: `Click <a href="${resetLink}">here</a> to reset password`,
  };
  sendMail(undefined, emailOptions);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

export async function sendSubscribeToNewsletter(formData: FormData) {
  const session = await auth();

  if (!session) {
    throw Error("Veuillez-vous connecter");
  }

  const email = formData.get("email")?.toString();

  if (email === session.user?.email) {
    await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        newsletter: true,
      },
    });
  } else {
    throw Error("Email incorrecte");
  }
  revalidatePath("/");
}
