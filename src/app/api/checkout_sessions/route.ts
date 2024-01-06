import { stripe } from "@/lib/stripe";

import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { currentUser } from "@/lib/auth";
import { LineItem } from "../../../../@types/lineItem";
import { getLocalStorage } from "@/lib/helpers/storageHelper";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

export async function POST() {
  const userSession = await currentUser();
  if (!userSession) {
    throw new Error("User session not found");
  }

  const cart = await prisma.cart.findFirst({
    where: { deleteAt: null },
    include: { cartItems: { where: { deleteAt: null } } },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Fetch all products in a single query
  const products = await prisma.product.findMany({
    where: {
      id: { in: cart.cartItems.map((item) => item.productId) },
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  const lineItems: LineItem[] = cart.cartItems.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    return {
      price_data: {
        currency: "EUR",
        product_data: { name: product.name },
        unit_amount: product.price,
      },
      quantity: item.quantity,
    };
  });
  // const deliveryOptionId = getLocalStorage("selectedDeliveryOption", null);
  // // Fetch the delivery option
  // const deliveryOption = await prisma.deliveryOption.findUnique({
  //   where: { id: deliveryOptionId },
  // });

  // if (!deliveryOption) {
  //   throw new Error("Delivery option not found");
  // }

  // Add delivery price to line items
  // lineItems.push({
  //   price_data: {
  //     currency: "EUR",
  //     product_data: { name: "Delivery" },
  //     unit_amount: deliveryOption.price, // Assuming 'price' is a field in your delivery option
  //   },
  //   quantity: 1,
  // });

  if (lineItems.length === 0) {
    throw new Error("No items in the cart");
  }

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.NEXTAUTH_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/result?session_id={CHECKOUT_SESSION_ID}`,
  };
  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create(params);

  await prisma.stripeSession.create({
    data: {
      stripeId: checkoutSession.id,
      isProcessed: false,
    },
  });

  return new Response(JSON.stringify(checkoutSession), { status: 200 });
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId!);
    return new Response(JSON.stringify(session));
  } catch (error: any) {
    throw new Error(`Product not found: ${error.message}`);
  }
}
