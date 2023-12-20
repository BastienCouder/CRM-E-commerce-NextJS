"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  OrderItemsProps,
  OrderProps,
  createOrder,
  getOrder,
} from "@/lib/db/order";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createOrderIncrementation(
  cartId: string,
  deliveryId: string
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return;
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
  OrderIncart: OrderItemsProps | null,
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
          id: OrderIncart?.id,
        },
        data: {
          orderId: order?.id,
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
      const orderNumber = generateOrderNumber();

      await prisma.orderItems.create({
        data: {
          orderNumber,
          orderId: order?.id,
          cartId,
          deliveryItemsId: deliveryItem.id,
          status: "waiting",
          deleteAt: null,
        },
      });
    }
  }
}

async function updateCart(cartId: string, userId: string) {
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

import "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import { createStripeSession } from "@/app/api/create-stripe-session/route";
import { env } from "@/lib/env";
import { generateOrderNumber } from "@/helpers/utils";

export async function handleStripePayment(carId: string, deliveryId: string) {
  if (carId && deliveryId) {
    try {
      const stripeKey = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

      if (!stripeKey) {
        console.error("Stripe key is not defined.");
        return;
      }
      loadStripe.setLoadParameters({ advancedFraudSignals: false });
      const stripe = await loadStripe(stripeKey);

      console.log("cle stripe" + stripe);

      const session = await createStripeSession(carId, deliveryId);
      console.log(session);

      if (session) {
        const result = await stripe?.redirectToCheckout({
          sessionId: session.id,
        });
        console.log(result);

        if (result?.error) {
          console.error(result.error.message);
        }
      } else {
        console.error("Stripe session is not defined.");
      }
    } catch (error) {
      console.error(
        "An error occurred while creating the payment session:",
        error
      );
    }
  }
}
