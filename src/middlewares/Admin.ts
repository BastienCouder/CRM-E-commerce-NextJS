// middlewares/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function checkUserRole(): Promise<boolean> {
  try {
    const session = await getServerSession({ ...authOptions });
    const userRole = session?.user?.account;

    if (userRole === "admin") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du rôle utilisateur :",
      error
    );
    throw error;
  }
}
