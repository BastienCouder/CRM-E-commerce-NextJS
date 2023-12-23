"use server";
import { env } from "@/lib/env";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { verify, JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

interface DecodedToken extends JwtPayload {
  userId: string;
}

export async function ResetPassword(formData: FormData, token: string) {
  const password = formData.get("password")?.toString();

  // Vérifier si le token est valide
  const secret = env.JWT_SECRET!;
  const decodedToken = verify(token, secret) as DecodedToken;

  if (!decodedToken || !decodedToken.userId) {
    throw new Error("Token invalide");
  }

  // Récupérer l'utilisateur associé à l'ID du token
  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken.userId,
    },
  });

  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  const hashedPassword = await hash(password!, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      hashedPassword,
    },
  });

  return "Mot de passe réinitialisé avec succès";
}
