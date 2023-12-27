"use server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const transporter = nodemailer.createTransport(nodemailerConfig);
import { env } from "@/lib/env";
import { nodemailerConfig } from "@/lib/nodemailerConfig";

const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUserByEmail({
    where: {
      email,
    },
  });

  return user;
};
export async function sendForgotPassword(formData: FormData) {
  const email = formData.get("email")?.toString();

  if (email) {
    const user = await findUserByEmail(email);

    if (user) {
      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      const resetPasswordLink = `${env.NEXTAUTH_URL}/auth/reset-password/${token}`;

      const mailOptions = {
        from: env.EMAIL_FROM,
        to: email,
        subject: "Réinitialisation de mot de passe",
        html: `
        <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
        <a href="${resetPasswordLink}">Réinitialiser le mot de passe</a>
      `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(
          "E-mail de réinitialisation de mot de passe envoyé avec succès"
        );
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
      }
    } else {
      console.error("Utilisateur introuvable pour l'e-mail spécifié.");
    }
  } else {
    console.error(
      "L'e-mail n'est pas spécifié dans les données du formulaire."
    );
  }
}
