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
  const articleInCart = cart.cartItems.find(
    (item) => item.productId === productId
  );

  const newQuantity = quantity;
  if (articleVariantInCart) {
    if (newQuantity === 0) {
      await deleteItemIncrementFromCart(articleVariantInCart);
    } else {
      await updateItemIncrementFromCart(newQuantity, articleVariantInCart);
    }
  } else {
    if (newQuantity === 0) {
      await deleteItemIncrementFromCart(articleInCart);
    } else {
      await updateItemIncrementFromCart(newQuantity, articleInCart);
    }
  }

  revalidatePath("/cart");
}

async function updateItemIncrementFromCart(newQuantity: number, item: any) {
  await prisma.cartItems.update({
    where: {
      id: item.id,
    },
    data: { quantity: newQuantity },
  });
}

//Delete Item From Whishlist
async function deleteItemIncrementFromCart(item: any) {
  await prisma.cartItems.delete({
    where: {
      id: item.id,
    },
  });
}

export async function DeleteProduct(
  productId: string,
  variantId: string | undefined
) {
  const cart = (await getCart()) ?? (await createCart());

  const articleVariantInCart = cart.cartItems.find(
    (item) => item.variantId === variantId && item.productId === productId
  );
  const articleInCart = cart.cartItems.find(
    (item) => item.productId === productId
  );

  if (articleVariantInCart) {
    await prisma.cartItems.delete({
      where: {
        id: articleVariantInCart.id,
      },
    });
  } else {
    await prisma.cartItems.delete({
      where: {
        id: articleInCart?.id,
      },
    });
  }
  revalidatePath("/cart");
}
