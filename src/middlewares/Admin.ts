import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function checkUserRole() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.account === "admin") {
      return true;
    }

    return false;
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du rôle utilisateur :",
      error
    );
    return false;
  }
}
