"use server";

import { createNewOrder } from "./create-order";

export async function handleOrderCreation(session_id: string) {
  if (session_id) {
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

      const cart = await prisma.cart.findFirst({
        where: { deleteAt: null },
        include: { cartItems: { where: { deleteAt: null } } },
      });

      const deliveryItem = await prisma.deliveryItems.findFirst({
        where: { Default: true },
      });

      const deliveryOptionId = "delivery";

      const orderResponse = await createNewOrder(
        cart.id,
        deliveryItem.id,
        deliveryOptionId
      );
      console.log(orderResponse);
    } catch (error) {
      console.error("Error during order creation:", error);
    }
  }
}
