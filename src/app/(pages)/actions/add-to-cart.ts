"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CartProps, createCart, getCart } from "@/lib/db/cart";
import { CartItem } from "@/schemas/DbSchema";

export async function addProductToCart(productId: string): Promise<void> {
  const cart: CartProps | null = (await getCart()) ?? (await createCart());

  const productInCart: CartItem | undefined = cart.cartItems.find(
    (item: CartItem) => item.productId === productId
  );

  if (productInCart) {
    await updateCartItemQuantity(productId, productInCart);
  } else {
    await createNewCartItem(cart, productId);
  }
  revalidatePath(`/products/${productId}`);
  revalidatePath("/wishlist");
}

async function createNewCartItem(
  cart: CartProps,
  productId: string
): Promise<void> {
  const newCartItem = {
    cartId: cart.id,
    productId,
    quantity: 1,
    deleteAt: null,
  };
  await prisma.cartItems.create({ data: newCartItem });
}

async function updateCartItemQuantity(
  productId: string,
  productInCart: CartItem
): Promise<void> {
  await prisma.cartItems.update({
    where: { id: productInCart.id },
    data: { quantity: { increment: 1 } },
  });
}
