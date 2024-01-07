"use server";

import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateCart } from "./create-order-session";
import { sendOrderEmail } from "@/lib/email/order";

export async function handleOrderCreation(session_id: string) {
  if (!session_id) {
    throw new Error("Session ID is required");
  }

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/checkout_sessions?sessionId=${session_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const session = await currentUser();
    if (!session) {
      throw new Error("Unauthorized: No current user session found");
    }

    await prisma.$transaction(async (prisma) => {
      const cart = await prisma.cart.findFirst({
        where: { deleteAt: null },
      });

      const orderItem = await prisma.orderItems.findFirst({
        where: { isPaid: false },
      });

      if (!cart && !orderItem) {
        return;
      }

      await prisma.orderItems.update({
        where: { id: orderItem?.id },
        include: {
          cart: {
            include: {
              cartItems: {
                where: { deleteAt: null },
                include: {
                  product: true,
                },
              },
            },
          },
          deliveryItems: true,
          deliveryOption: true,
        },
        data: { isPaid: true },
      });

      await updateCart(cart?.id!, session.id);

      await prisma.stripeSession.update({
        where: { stripeId: session_id },
        data: { isProcessed: true },
      });

      await sendOrderEmail(session.email!, orderItem);
    });
  } catch (error) {
    console.error("Error during order creation:", error);
    throw error;
  }
}
