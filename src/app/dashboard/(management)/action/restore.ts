"use server";

import { currentUser, roleCheckMiddleware } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function restoreItem(itemId: string) {
  const session = await currentUser();

  if (roleCheckMiddleware(session, ["ADMIN"])) {
    try {
      const restoredItem = await prisma.product
        .update({
          where: { id: itemId },
          data: { deleteAt: null, status: "available" },
        })
        .catch(async () => {
          return await prisma.orderItems.update({
            where: { id: itemId },
            data: { deleteAt: null, status: "waiting" },
          });
        });

      revalidatePath("/dashboard");

      return restoredItem;
    } catch (error: any) {
      throw new Error(
        `Erreur lors de la restauration de l'élément : ${error.message}`
      );
    }
  } else {
    throw new Error(
      "Accès refusé : Vous n'avez pas les autorisations nécessaires."
    );
  }
}
