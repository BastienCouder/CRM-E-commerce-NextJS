"use server";

import { OrderProps, createOrder, getOrder } from "@/lib/db/order";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrderIncrementation(
  cartId: string,
  deliveryId: string,
  deliveryOptionId: string
): Promise<void> {
  const session = await currentUser();

  if (!session) {
    return;
  }

  const userId = session.id;
  const order = (await getOrder()) || (await createOrder());
  const OrderInSession = order?.orderItems?.find(
    (item: OrderItem) => item.cartId === cartId
  );

  if (OrderInSession) {
    await updateOrderItem(OrderInSession, order, cartId, deliveryId);
  } else {
    await createOrderItem(order, cartId, deliveryId, deliveryOptionId);
  }

  await updateCart(cartId, userId);
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
          orderId: order!.id,
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
import { generateOrderNumber } from "@/lib/utils";
import DeliveryInfo from "../../../../components/profile/delivery-info";
import { OrderItem } from "@/schemas/DbSchema";
import { currentUser } from "@/lib/auth";

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
