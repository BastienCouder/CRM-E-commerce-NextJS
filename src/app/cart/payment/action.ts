"use server";

import { createOrder, getOrder } from "@/lib/db/order";
import { prisma } from "@/lib/db/prisma";

import { revalidatePath } from "next/cache";

export async function createOrderIncrementation(
  cartId: string,
  deliveryId: string
) {
  const order = (await getOrder()) ?? (await createOrder(cartId, deliveryId));

  const OrderIncart = order?.orderItems.find(
    (item) => item.cartId === cartId && item.deliveryId === deliveryId
  );

  if (OrderIncart) {
    await prisma.orderItems.delete({
      where: {
        id: OrderIncart.id,
      },
    });
    await prisma.orderItems.create({
      data: {
        orderId: order?.id,
        cartId,
        deliveryId,
        isPaid: false,
      },
    });
  } else {
    await prisma.orderItems.create({
      data: {
        orderId: order?.id,
        cartId,
        deliveryId,
        isPaid: false,
      },
    });
  }

  revalidatePath("/cart");
}
