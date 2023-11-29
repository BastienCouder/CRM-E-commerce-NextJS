"use server";

import { revalidatePath } from "next/cache";

export async function useServerSoftDelete(itemId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: itemId },
    });

    const order = await prisma.orderItems.findUnique({
      where: { id: itemId },
    });

    if (product) {
      const deletedProduct = await prisma.product.update({
        where: { id: itemId },
        data: { deleteAt: new Date(), status: "delete" },
      });

      revalidatePath(`/dashboard/products`);
      revalidatePath(`/products`);
      revalidatePath(`/dashboard/products/${itemId}`);
      return deletedProduct;
    } else if (order) {
      const deletedOrder = await prisma.orderItems.update({
        where: { id: itemId },
        data: { deleteAt: new Date(), status: "delete" },
      });

      revalidatePath(`/dashboard/orders`);
      revalidatePath(`/dashboard/orders/${itemId}`);
      return deletedOrder;
    } else {
      throw Error("Item not found.");
    }
  } catch (error: any) {
    throw Error("Erreur lors de la suppression :", error);
  }
}
export async function useServerDelete(itemId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: itemId },
    });

    const order = await prisma.orderItems.findUnique({
      where: { id: itemId },
    });

    if (product) {
      const deletedProduct = await prisma.product.delete({
        where: { id: itemId },
      });

      revalidatePath(`/dashboard/products`);
      revalidatePath(`/products`);
      revalidatePath(`/dashboard/products/${itemId}`);
      return deletedProduct;
    } else if (order) {
      const deletedOrder = await prisma.orderItems.delete({
        where: { id: itemId },
      });

      revalidatePath(`/orders`);
      revalidatePath(`/orders/${itemId}`);
      return deletedOrder;
    } else {
      throw Error("Item not found or invalid type.");
    }
  } catch (error: any) {
    throw Error("Erreur lors de la suppression de l'élément :", error);
  }
}
