"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ShoppingOrder, createOrder, getOrder } from "@/lib/db/order";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createOrderIncrementation(
  cartId: string,
  deliveryId: string
) {
  const session = await getServerSession(authOptions);
  if (session) {
    const userId = session.user.id;
    const order = (await getOrder()) ?? (await createOrder(cartId, deliveryId));
    const OrderInSession = order?.orderItems.find(
      (item) => item.cartId === cartId && item.deliveryId === deliveryId
    );

    if (OrderInSession) {
      await updateOrderItem(OrderInSession, order, cartId, deliveryId);
      await updateDelivery(deliveryId, userId);
      await updateCart(cartId, userId);
    } else {
      await createOrderItem(order, cartId, deliveryId);
      await updateDelivery(deliveryId, userId);
      await updateCart(cartId, userId);
    }

    revalidatePath("/cart");
  }
}

async function updateOrderItem(
  OrderIncart: any,
  order: ShoppingOrder | null,
  cartId: string,
  deliveryId: string
) {
  await prisma.orderItems.update({
    where: {
      id: OrderIncart.id,
    },
    data: {
      orderId: order?.id,
      cartId,
      deliveryId,
      isPaid: false,
    },
  });
}

async function createOrderItem(
  order: ShoppingOrder | null,
  cartId: string,
  deliveryId: string
) {
  await prisma.orderItems.create({
    data: {
      orderId: order?.id,
      cartId,
      deliveryId,
      isPaid: false,
    },
  });
}

async function updateDelivery(deliveryId: string, userId: string) {
  await prisma.delivery.findUnique({
    where: {
      id: deliveryId,
      isPaid: false,
    },
    include: { deliveryItems: true },
  });
  await prisma.delivery.update({
    where: {
      id: deliveryId,
      userId,
    },
    data: { isPaid: true },
  });
}

async function updateCart(cartId: string, userId: string) {
  await prisma.cart.findUnique({
    where: {
      id: cartId,
      isPaid: false,
    },
    include: { cartItems: true },
  });
  await prisma.cart.update({
    where: {
      id: cartId,
      userId,
    },
    data: { isPaid: true },
  });
}
