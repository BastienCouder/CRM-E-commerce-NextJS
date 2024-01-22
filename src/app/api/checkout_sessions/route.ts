import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { currentUser } from "@/lib/auth";
import { LineItem } from "../../../../@types/lineItem";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { defaultLocale, getLocale, locales } from "@/middleware";

export async function POST(req: NextRequest) {
  const locale = getLocale(req, defaultLocale, locales);
  const userSession = await currentUser();
  if (!userSession) {
    throw new Error("User session not found");
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: userSession.id, deleteAt: null },
    include: { cartItems: true },
  });

  if (!cart || cart.cartItems.length === 0) {
    throw new Error("No items in the cart or cart not found");
  }

  const lineItems: LineItem[] = await Promise.all(
    cart.cartItems.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      return {
        price_data: {
          currency: "eur",
          product_data: { name: product.name },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      };
    })
  );

  // Assume deliveryOptionId is retrieved from user's session or another source

  // const deliveryOption = await prisma.deliveryOption.findUnique({
  //   where: { id: deliveryOptionId },
  // });

  // if (deliveryOption) {
  //   lineItems.push({
  //     price_data: {
  //       currency: "eur",
  //       product_data: { name: "Delivery" },
  //       unit_amount: deliveryOption.price,
  //     },
  //     quantity: 1,
  //   });
  // }

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.NEXTAUTH_URL}/${locale}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/${locale}/checkout?session_id={CHECKOUT_SESSION_ID}`,
  };
  const checkoutSession = await stripe.checkout.sessions.create(params);

  await prisma.stripeSession.create({
    data: {
      stripeId: checkoutSession.id,

      isProcessed: false,
    },
  });

  return new Response(JSON.stringify(checkoutSession), { status: 200 });
}

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  const sessionId = request.query.sessionId as string;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    response.status(200).json(session);
  } catch (error: any) {
    response
      .status(500)
      .json({ error: `Stripe session retrieval failed: ${error.message}` });
  }
}
