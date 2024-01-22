"use server";

import { currentUser, roleCheckMiddleware } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function DeleteItem(itemId: string) {
  const session = await currentUser();

  if (roleCheckMiddleware(session, ["ADMIN"])) {
    try {
      const deletedProduct = await prisma.product
        .delete({
          where: { id: itemId },
        })
        .catch(async () => {
          return await prisma.orderItems.delete({
            where: { id: itemId },
          });
        });
      revalidatePath("/dashboard");

      return deletedProduct;
    } catch (error: any) {
      throw new Error(
        `Erreur lors de la suppression de l'élément : ${error.message}`
      );
    }
  } else {
    throw new Error(
      "Accès refusé : Vous n'avez pas les autorisations nécessaires."
    );
  }
}
