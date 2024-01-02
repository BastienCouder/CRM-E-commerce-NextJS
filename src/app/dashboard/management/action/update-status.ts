"use server";

import { currentUser, roleCheckMiddleware } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateStatusItem(itemId: string, newStatus: string) {
  const session = await currentUser();

  if (roleCheckMiddleware(session, ["ADMIN"])) {
    try {
      const updateData = {
        status: newStatus,
        ...(newStatus === "cancel" || newStatus === "refunded"
          ? { deleteAt: new Date() }
          : {}),
      };

      const updatedItem = await prisma.product
        .update({
          where: { id: itemId },
          data: updateData,
        })
        .catch(async () => {
          return await prisma.orderItems.update({
            where: { id: itemId },
            data: updateData,
          });
        });

      revalidatePath("/dashboard");

      return updatedItem;
    } catch (error: any) {
      throw new Error(
        `Erreur lors de la mise à jour du statut de l'élément : ${error.message}`
      );
    }
  } else {
    throw new Error(
      "Accès refusé : Vous n'avez pas les autorisations nécessaires."
    );
  }
}
