"use server";

import { currentUser } from "@/lib/auth";
import { OrderProps, createOrder, getOrder } from "@/lib/db/order";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { OrderItem } from "@/schemas/db-schema";
import { revalidatePath } from "next/cache";

export async function createNewOrder(
  cartId: string,
  deliveryId: string,
  deliveryOptionId: string
): Promise<void> {
  const session = await currentUser();

  if (!session) {
    return;
  }

  const order = (await getOrder()) || (await createOrder());
  const OrderInSession = order.orderItems.find(
    (item: OrderItem) => item.cartId === cartId
  );

  if (OrderInSession) {
    await updateOrderItem(OrderInSession, order, cartId, deliveryId);
  } else {
    await createOrderItem(order, cartId, deliveryId, deliveryOptionId);
  }

  revalidatePath("/cart");
}

async function updateOrderItem(
  OrderIncart: OrderItem | null,
  order: OrderProps | null,
  cartId: string,
  deliveryId: string
) {
  const deliveryItemId = await prisma.delivery.findUnique({
    where: {
      id: deliveryId,
    },
    include: {
      deliveryItems: {
        where: {
          Default: true,
        },
      },
    },
  });

  if (deliveryItemId) {
    const deliveryItem = deliveryItemId.deliveryItems[0];

    if (deliveryItem) {
      await prisma.orderItems.update({
        where: {
          id: OrderIncart.id,
        },
        data: {
          orderId: order.id,
          cartId,
          deliveryItemsId: deliveryItem.id,
          deleteAt: new Date(),
        },
      });
    }
  }
}

async function createOrderItem(
  order: OrderProps | null,
  cartId: string,
  deliveryId: string,
  deliveryOptionId: string
) {
  const deliveryItemId = await prisma.delivery.findUnique({
    where: {
      id: deliveryId,
    },
    include: {
      deliveryItems: {
        where: {
          Default: true,
        },
      },
    },
  });

  if (deliveryItemId) {
    const deliveryItem = deliveryItemId.deliveryItems[0];

    if (deliveryItem) {
      const orderNumber = generateOrderNumber();

      await prisma.orderItems.create({
        data: {
          orderNumber,
          orderId: order.id,
          cartId,
          deliveryItemsId: deliveryItem.id,
          status: "waiting",
          deliveryOptionId,
          deleteAt: null,
        },
      });
    }
  }
}

export async function updateCart(cartId: string, userId: string) {
  const cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
    },
    include: { cartItems: true },
  });

  if (cart) {
    await prisma.cart.update({
      where: {
        id: cartId,
        userId,
      },
      data: { deleteAt: new Date() },
    });
  }
}
