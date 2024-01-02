import { env } from "../env";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = env.NEXTAUTH_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "2FA Code",
    text: `Ceci est le corps de l'email en texte. Your 2FA code: ${token}`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    text: `Click "${resetLink}">here to reset password`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Confirm your email",
    html: `Click "${confirmLink}">here to confirm email.</p>`,
  });
};
