"use server";

import { currentUser, roleCheckMiddleware } from "@/lib/auth";
import { ProductProps } from "@/lib/db/product";
import { revalidatePath } from "next/cache";

export async function updateProductFavourites(
  productId: string,
  newFavorite: string
): Promise<ProductProps | null> {
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

      let updatedPriority;
      if (product.priority && product.priority.includes(newFavorite)) {
        updatedPriority = product.priority.filter(
          (p: string) => p !== newFavorite
        );
      } else {
        updatedPriority = product.priority
          ? [...product.priority, newFavorite]
          : [newFavorite];
      }

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { priority: updatedPriority },
      });

      revalidatePath("/dashboard");

      return updatedProduct;
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
