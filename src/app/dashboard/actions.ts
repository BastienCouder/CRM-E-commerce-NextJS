"use server";

import { revalidatePath } from "next/cache";

export async function useServerUpdateStatus(itemId: string, newStatus: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: itemId },
    });

    const orderItem = await prisma.orderItems.findUnique({
      where: { id: itemId },
    });

    if (product) {
      const updatedProduct = await prisma.product.update({
        where: { id: itemId },
        data: {
          status: newStatus,
        },
      });

      revalidatePath(`/dashboard/products`);
      revalidatePath(`/products`);
      revalidatePath(`/dashboard/products/${itemId}`);

      return updatedProduct;
    } else if (orderItem) {
      const updatedOrderItem = await prisma.orderItems.update({
        where: { id: itemId },
        data: {
          status: newStatus,
        },
      });

      revalidatePath(`/dashboard/orders`);
      revalidatePath(`/dashboard/orders/${itemId}`);

      return updatedOrderItem;
    } else {
      throw Error("Item not found.");
    }
  } catch (error: any) {
    throw Error(
      "Erreur lors de la mise à jour du statut de l'élément :",
      error
    );
  }
}

export async function useServerSoftDelete(itemId: string | string[]) {
  try {
    const deleteProduct = async (id: string) => {
      await prisma.product.update({
        where: { id },
        data: { deleteAt: new Date(), status: "delete" },
      });
      revalidatePath(`/dashboard/products`);
      revalidatePath(`/products`);
      revalidatePath(`/dashboard/products/${id}`);
    };

    const deleteOrder = async (id: string) => {
      await prisma.orderItems.update({
        where: { id },
        data: { deleteAt: new Date(), status: "delete" },
      });
      revalidatePath(`/orders`);
      revalidatePath(`/orders/${id}`);
    };

    if (Array.isArray(itemId)) {
      await Promise.all(
        itemId.map(async (id) => {
          const product = await prisma.product.findUnique({ where: { id } });
          const order = await prisma.orderItems.findUnique({ where: { id } });

          if (product) {
            await deleteProduct(id);
          } else if (order) {
            await deleteOrder(id);
          }
        })
      );
    } else {
      const product = await prisma.product.findUnique({
        where: { id: itemId },
      });
      const order = await prisma.orderItems.findUnique({
        where: { id: itemId },
      });

      if (product) {
        await deleteProduct(itemId);
      } else if (order) {
        await deleteOrder(itemId);
      } else {
        throw Error("Item not found.");
      }
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
export async function useServerRestore(itemId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: itemId },
    });

    const order = await prisma.orderItems.findUnique({
      where: { id: itemId },
    });

    if (product) {
      const restoredProduct = await prisma.product.update({
        where: { id: itemId },
        data: { deleteAt: null, status: "available" },
      });

      revalidatePath(`/dashboard/products`);
      revalidatePath(`/products`);
      revalidatePath(`/dashboard/products/${itemId}`);

      return restoredProduct;
    } else if (order) {
      const restoredOrder = await prisma.orderItems.update({
        where: { id: itemId },
        data: { deleteAt: null, status: "waiting" },
      });

      revalidatePath(`/dashboard/orders`);
      revalidatePath(`/dashboard/orders/${itemId}`);

      return restoredOrder;
    } else {
      throw Error("Item not found or invalid type.");
    }
  } catch (error: any) {
    throw Error("Erreur lors de la restauration de l'élément :", error);
  }
}
