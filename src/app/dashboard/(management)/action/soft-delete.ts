"use server";

import { currentUser, roleCheckMiddleware } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Order, Product } from "@/schemas/db-schema";
import { revalidatePath } from "next/cache";

export async function softDeleteItem(
  itemId: string | string[]
): Promise<Product | Order> {
  const deleteItem = async (id: string) => {
    const deleteData = { deleteAt: new Date(), status: "delete" };
    const updatedItem = await prisma.product
      .update({
        where: { id },
        data: deleteData,
      })
      .catch(async () => {
        return await prisma.orderItems.update({
          where: { id },
          data: deleteData,
        });
      });

    return updatedItem;
  };

  const session = await currentUser();

  if (roleCheckMiddleware(session?.role, ["ADMIN"])) {
    try {
      if (Array.isArray(itemId)) {
        await Promise.all(itemId.map((id) => deleteItem(id)));
      } else {
        await deleteItem(itemId);
      }
      revalidatePath("/dashboard");
    } catch (error: any) {
      throw new Error(`Erreur lors de la suppression : ${error.message}`);
    }
  } else {
    throw new Error(
      "Accès refusé : Vous n'avez pas les autorisations nécessaires."
    );
  }
}
