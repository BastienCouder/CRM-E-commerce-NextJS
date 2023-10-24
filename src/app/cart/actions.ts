"use server";

import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function UpdateProductQuantity(
  productId: string,
  quantity: number,
  variantId: string | null
) {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.cartItems.find(
    (item) => item.productId === productId && item.variantId === variantId
  );

  if (articleInCart) {
    const newQuantity = quantity;
    console.log();

    if (newQuantity === 0) {
      await prisma.cartItems.delete({
        where: {
          id: articleInCart.id,
        },
      });
    } else {
      if (articleInCart) {
        await prisma.cartItems.update({
          where: {
            id: articleInCart.id,
          },
          data: { quantity: newQuantity },
        });
      } else {
        await prisma.cartItems.create({
          data: {
            cartId: cart.id,
            productId,
            variantId,
            quantity,
          },
        });
      }
    }
  }

  revalidatePath("/cart");
}

export async function DeleteProduct(productId: string) {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.cartItems.find(
    (item) => item.productId === productId
  );

  if (articleInCart) {
    await prisma.cartItems.delete({
      where: {
        id: articleInCart.id,
      },
    });
  }
  revalidatePath("/cart");
}
