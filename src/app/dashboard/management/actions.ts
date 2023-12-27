"use server";
import { revalidatePath } from "next/cache";

export async function updateStatusItem(itemId: string, newStatus: string) {
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

    revalidatePath(`/dashboard/products`);
    revalidatePath(`/dashboard/orders`);
    revalidatePath(`/dashboard/products/${itemId}`);
    revalidatePath(`/dashboard/orders/${itemId}`);

    return updatedItem;
  } catch (error: any) {
    throw new Error(
      `Erreur lors de la mise à jour du statut de l'élément : ${error.message}`
    );
  }
}

export async function softDeleteItem(itemId: string | string[]) {
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

    revalidatePath(`/dashboard/products`);
    revalidatePath(`/dashboard/orders`);
    revalidatePath(`/dashboard/products/${id}`);
    revalidatePath(`/dashboard/orders/${id}`);

    return updatedItem;
  };

  try {
    if (Array.isArray(itemId)) {
      await Promise.all(itemId.map((id) => deleteItem(id)));
    } else {
      await deleteItem(itemId);
    }
  } catch (error: any) {
    throw new Error(`Erreur lors de la suppression : ${error.message}`);
  }
}

export async function DeleteItem(itemId: string) {
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

    revalidatePath(`/dashboard/products`);
    revalidatePath(`/dashboard/orders`);
    revalidatePath(`/dashboard/products/${itemId}`);
    revalidatePath(`/dashboard/orders/${itemId}`);

    return deletedProduct;
  } catch (error: any) {
    throw new Error(
      `Erreur lors de la suppression de l'élément : ${error.message}`
    );
  }
}

export async function restoreItem(itemId: string) {
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

    revalidatePath(`/dashboard/products`);
    revalidatePath(`/dashboard/orders`);
    revalidatePath(`/dashboard/products/${itemId}`);
    revalidatePath(`/dashboard/orders/${itemId}`);

    return restoredItem;
  } catch (error: any) {
    throw new Error(
      `Erreur lors de la restauration de l'élément : ${error.message}`
    );
  }
}
