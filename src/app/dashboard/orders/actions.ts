"use server";
import { revalidatePath } from "next/cache";

export async function useServerUpdateProductStatus(
  orderId: string,
  newStatus: string
) {
  try {
    const order = await prisma.orderItems.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.error("order not found.");
      return null;
    }

    const updatedOrder = await prisma.orderItems.update({
      where: { id: orderId },
      data: {
        status: newStatus,
      },
    });

    revalidatePath(`/orders`);
    revalidatePath(`/orders/${orderId}`);
    console.log("succes");

    return updatedOrder;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut du produit :",
      error
    );
    return null;
  }
}
