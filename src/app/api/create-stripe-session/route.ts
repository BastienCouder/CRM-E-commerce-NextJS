import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { LineItem } from "../../../../@types/lineItem";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";

const prisma = new PrismaClient();

/**
 * Crée une session Stripe pour le paiement.
 *
 * @param cartId - L'ID du panier.
 * @param deliveryId - L'ID de la livraison.
 * @returns Une session Stripe.
 */
export async function createStripeSession(cartId: string, deliveryId: string) {
  // Vérifie la session utilisateur
  const userSession = await getServerSession(authOptions);

  if (!userSession) {
    return; // Sort prématurément si aucune session n'est trouvée
  }

  // Récupère le panier non payé
  const cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
      isPaid: false,
    },
    include: { cartItems: true },
  });

  // Récupère les détails de livraison
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

  // Gère les cas où le panier ou les détails de livraison sont manquants
  if (!deliveryItem || !cart) {
    throw new Error("Détails de livraison ou panier manquants");
  }

  // Construit la liste des articles à acheter
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

  // Gère le cas où aucun article n'est trouvé dans le panier
  if (lineItems.length === 0) {
    throw new Error("Aucun article trouvé dans le panier");
  }

  // Crée la session Stripe
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
