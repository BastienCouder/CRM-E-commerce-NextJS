import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { LineItem } from "../../../../@types/lineItem";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";

const prisma = new PrismaClient();

export async function createStripeSession(cartId: string, deliveryId: string) {
  const Usersession = await getServerSession(authOptions);

  if (!Usersession) {
    return; // Exit early if no session is found
  }

  const cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
      isPaid: false,
    },
    include: { cartItems: true },
  });
  const deliveryItem = await prisma.delivery.findUnique({
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

  if (!deliveryItem || !cart) {
    throw new Error("Delivery or Cart missing");
  }
  const lineItems: LineItem[] = [];

  for (const item of cart.cartItems) {
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });

    if (product) {
      lineItems.push({
        price_data: {
          currency: "EUR",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      });
    }
  }

  if (lineItems.length === 0) {
    throw new Error("Aucun article trouvé dans le panier");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${env.NEXTAUTH_URL}/profile`,
    cancel_url: `${env.NEXTAUTH_URL}/cancel`,
  });
  return {
    id: session.id,
  };
}
