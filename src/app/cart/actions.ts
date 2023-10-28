"use server";

import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { createWishlist, getWishlist } from "@/lib/db/wishlist";
import { revalidatePath } from "next/cache";

export async function UpdateProductQuantity(
  productId: string,
  quantity: number,
  variantId: string | null
) {
  const cart = (await getCart()) ?? (await createCart());

  const articleVariantInCart = cart.cartItems.find(
    (item) => item.variantId === variantId && item.productId === productId
  );

  if (articleVariantInCart) {
    const newQuantity = quantity;

    if (newQuantity === 0) {
      await prisma.cartItems.delete({
        where: {
          id: articleVariantInCart.id,
        },
      });
    } else {
      if (articleVariantInCart) {
        await prisma.cartItems.update({
          where: {
            id: articleVariantInCart.id,
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
