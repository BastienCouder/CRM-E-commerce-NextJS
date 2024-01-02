"use server";
import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCartItemQuantity(
  productId: string,
  quantity: number
): Promise<void> {
  const cart = (await getCart()) ?? (await createCart());

  const cartItem = cart.cartItems.find((item) => item.productId === productId);

  if (quantity === 0) {
    if (cartItem) {
      await removeCartItem(cartItem.id);
    }
  } else {
    if (cartItem) {
      await changeCartItemQuantity(cartItem.id, quantity);
    }
  }

  revalidatePath("/cart");
}

async function changeCartItemQuantity(
  cartItemId: string,
  newQuantity: number
): Promise<void> {
  await prisma.cartItems.update({
    where: { id: cartItemId },
    data: { quantity: newQuantity },
  });
}

export async function removeCartItem(cartItemId: string): Promise<void> {
  await prisma.cartItems.update({
    where: { id: cartItemId },
    data: { deleteAt: new Date() },
  });
}

export async function deleteProductFromCart(productId: string): Promise<void> {
  const cart = (await getCart()) ?? (await createCart());

  const cartItem = cart.cartItems.find((item) => item.productId === productId);
  if (cartItem) {
    await removeCartItem(cartItem.id);
  }

  revalidatePath("/cart");
}
