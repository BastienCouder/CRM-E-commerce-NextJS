"use server";

import { currentUser, roleCheckMiddleware } from "@/lib/auth";

export async function updateProductStock(
  productId: string,
  newStock: number
): Promise<void> {
  const session = await currentUser();

  if (roleCheckMiddleware(session?.role, ["ADMIN"])) {
    try {
      await prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
      return;
    }
  }
}
