"use server";
import { CartProps, createCart, getCart } from "@/lib/db/cart";
import { createWishlist, getWishlist } from "@/lib/db/wishlist";
import { prisma } from "@/lib/prisma";
import { WishlistItem } from "@/schemas/DbSchema";

import { revalidatePath } from "next/cache";

export async function AddToCart(productId: string) {
  //DB REST
  const wishlist = (await getWishlist()) ?? (await createWishlist());
  const cart = (await getCart()) ?? (await createCart());

  //Find Method
  const articleInWishlistInCart = wishlist.wishlistItems.find(
    (item: WishlistItem) => item.productId === productId
  );

  //Global Function
  await handleAddToCart(cart, productId, articleInWishlistInCart);
}

//Add Item From Cart
async function handleAddToCart(
  cart: CartProps,
  productId: string,
  articleInWishlistInCart: WishlistItem | undefined
) {
  const cartItemData = {
    cartId: cart.id,
    productId,
    quantity: 1,
    deleteAt: null,
  };
  await prisma.cartItems.create({
    data: cartItemData,
  });

  if (articleInWishlistInCart) {
    await deleteItemFromWishlist(articleInWishlistInCart);
  }

  revalidatePath("/wishlist");
}

//Delete Item From Whishlist
export async function deleteItemFromWishlist(item: WishlistItem) {
  await prisma.wishlistItems.update({
    where: {
      id: item.id,
    },
    data: { deleteAt: new Date() },
  });
}
