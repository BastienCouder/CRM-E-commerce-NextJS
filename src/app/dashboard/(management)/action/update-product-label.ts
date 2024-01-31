"use server";

import { currentUser, roleCheckMiddleware } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProductLabel(productId: string, newLabel: string) {
  const session = await currentUser();

  if (roleCheckMiddleware(session, ["ADMIN"])) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        console.error("Product not found.");
        return null;
      }

      revalidatePath("/dashboard");

      return;
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut du produit :",
        error
      );
      return null;
    }
  } else {
    throw new Error(
      "Accès refusé : Vous n'avez pas les autorisations nécessaires."
    );
  }
}
