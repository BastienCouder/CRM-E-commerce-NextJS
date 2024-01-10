"use server";
import { createCart, getCart } from "@/lib/db/cart";
import { CartItem } from "@/schemas/db-schema";
import { revalidatePath } from "next/cache";
import { removeCartItem } from "./delete-product-from-cart";

export async function updateCartItemQuantity(
  productId: string,
  quantity: number
): Promise<void> {
  const cart = (await getCart()) ?? (await createCart());

  const cartItem = cart.cartItems.find(
    (item: CartItem) => item.productId === productId
  );

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
