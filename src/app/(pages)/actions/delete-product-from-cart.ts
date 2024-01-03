"use server";

import { createCart, getCart } from "@/lib/db/cart";
import { CartItem } from "@/schemas/DbSchema";
import { revalidatePath } from "next/cache";

export async function deleteProductFromCart(productId: string): Promise<void> {
  const cart = (await getCart()) ?? (await createCart());

  const cartItem = cart.cartItems.find(
    (item: CartItem) => item.productId === productId
  );
  if (cartItem) {
    await removeCartItem(cartItem.id);
  }

  revalidatePath("/cart");
}

export async function removeCartItem(cartItemId: string): Promise<void> {
  await prisma.cartItems.update({
    where: { id: cartItemId },
    data: { deleteAt: new Date() },
  });
}
