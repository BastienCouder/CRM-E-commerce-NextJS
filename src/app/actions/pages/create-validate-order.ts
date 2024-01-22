"use server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderEmail } from "@/lib/email/order";
import { updateCart } from "./create-order-session";

export async function handleOrderCreation(session_id: string) {
  if (!session_id) {
    throw new Error("Session ID is required");
  }

  const session = await currentUser();
  if (!session) {
    throw new Error("Unauthorized: No current user session found");
  }

  try {
    // Fetch the checkout session details
    const checkoutSessionResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/checkout_sessions?sessionId=${session_id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!checkoutSessionResponse.ok) {
      throw new Error(`HTTP error! Status: ${checkoutSessionResponse.status}`);
    }

    // Process order creation in a transaction
    await prisma.$transaction(async (prismaTransaction) => {
      const orderItem = await prismaTransaction.orderItems.findFirst({
        where: { isPaid: false },
        include: {
          cart: true,
          deliveryItems: true,
          deliveryOption: true,
        },
      });

      if (!orderItem) {
        throw new Error("Order item not found or already paid");
      }

      await prismaTransaction.orderItems.update({
        where: { id: orderItem.id },
        data: { isPaid: true },
      });

      if (orderItem.cartId) {
        await updateCart(orderItem.cartId, session.id);
      }

      await prismaTransaction.stripeSession.update({
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
