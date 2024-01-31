"use server";

import { currentUser, roleCheckMiddleware } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Product } from "@/schemas/db-schema";
import { revalidatePath } from "next/cache";

export async function duplicateProduct(
  productId: string
): Promise<Product | null> {
  const session = await currentUser();

  if (roleCheckMiddleware(session, ["ADMIN"])) {
    try {
      const productToDuplicate = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!productToDuplicate) {
        console.error("Product not found.");
        return null;
      }

      const duplicatedProduct = {
        ...productToDuplicate,
        id: undefined,
        name: `${productToDuplicate.name}-copy`,
      };

      const createdProduct = await prisma.product.create({
        data: duplicatedProduct,
      });

      revalidatePath("/dashboard");

      return createdProduct;
    } catch (error) {
      console.error("Erreur lors de la duplication du produit :", error);
      return null;
    }
  } else {
    throw new Error(
      "Accès refusé : Vous n'avez pas les autorisations nécessaires."
    );
  }
}
