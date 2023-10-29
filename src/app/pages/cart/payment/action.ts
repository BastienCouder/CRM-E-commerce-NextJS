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

  if (!session) {
    return; // Exit early if no session is found
  }

  const userId = session.user.id;
  const order = (await getOrder()) || (await createOrder(cartId, deliveryId));
  const OrderInSession = order?.orderItems.find(
    (item) => item.cartId === cartId
  );

  if (OrderInSession) {
    await updateOrderItem(OrderInSession, order, cartId, deliveryId);
  } else {
    await createOrderItem(order, cartId, deliveryId);
  }

  await updateCart(cartId, userId);
  revalidatePath("/cart");
}

async function updateOrderItem(
  OrderIncart: any,
  order: any,
  cartId: any,
  deliveryId: any
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
          orderId: order?.id,
          cartId,
          deliveryItemsId: deliveryItem.id,
          isPaid: false,
        },
      });
    }
  }
}

async function createOrderItem(order: any, cartId: any, deliveryId: any) {
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
      await prisma.orderItems.create({
        data: {
          orderId: order?.id,
          cartId,
          deliveryItemsId: deliveryItem.id,
          isPaid: false,
        },
      });
    }
  }
}

async function updateCart(cartId: any, userId: any) {
  const cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
      isPaid: false,
    },
    include: { cartItems: true },
  });

  if (cart) {
    await prisma.cart.update({
      where: {
        id: cartId,
        userId,
      },
      data: { isPaid: true },
    });
  }
}
