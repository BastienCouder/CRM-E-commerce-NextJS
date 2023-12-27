import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import PasswordResetForm from "./PasswordResetForm";
import { env } from "@/lib/env";

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default async function ResetPasswordPage({
  params: { token },
}: ResetPasswordPageProps) {
  const decodedToken = token && Array.isArray(token) ? token[0] : token;

  if (decodedToken) {
    try {
      const decoded = jwt.verify(decodedToken, env.JWT_SECRET!);

      console.log(decoded);
    } catch (error) {
      console.error("Erreur lors de la vérification du jeton :", error);

      redirect("/auth");
    }
  } else {
    console.error("Aucun jeton valide trouvé dans l'URL.");
  }

  return (
    <div>
      <PasswordResetForm token={decodedToken} />
    </div>
  );
}
