import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: { cartItems: { include: { product: true } } };
}>;

export type CartItemWithProduct = Prisma.CartItemsGetPayload<{
  include: { product: true };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export async function getCart(): Promise<ShoppingCart | null> {
  const localCartId = cookies().get("localCartId")?.value;
  const cart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { cartItems: { include: { product: true } } },
      })
    : null;

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.cartItems.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.cartItems.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    ),
  };
}

export async function createCart(): Promise<ShoppingCart> {
  const newCart = await prisma.cart.create({
    data: {},
  });

  cookies().set("localCartId", newCart.id);

  return {
    ...newCart,
    cartItems: [],
    size: 0,
    subtotal: 0,
  };
}
