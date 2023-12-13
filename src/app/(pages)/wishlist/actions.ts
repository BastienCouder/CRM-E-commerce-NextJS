"use server";
import { CartProps, createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import {
  WishlistItemsProps,
  createWishlist,
  getWishlist,
} from "@/lib/db/wishlist";
import { revalidatePath } from "next/cache";

export async function useServerAddToCart(
  productId: string,
  variantId: string | null
) {
  //DB REST
  const wishlist = (await getWishlist()) ?? (await createWishlist());
  const cart = (await getCart()) ?? (await createCart());

  //Find Method
  const articleInWishlistVariantInCart = wishlist.wishlistItems.find(
    (item) => item.variantId === variantId && item.productId === productId
  );
  const articleInWishlistInCart = wishlist.wishlistItems.find(
    (item) => item.productId === productId
  );

  //Global Function
  if (articleInWishlistVariantInCart) {
    await handleAddToCartWithVariant(
      cart,
      productId,
      variantId,
      articleInWishlistVariantInCart
    );
  } else {
    await handleAddToCartWithoutVariant(
      cart,
      productId,
      articleInWishlistInCart
    );
  }
}

//Add Item From Cart With Variant
async function handleAddToCartWithVariant(
  cart: CartProps,
  productId: string,
  variantId: string | null,
  articleInWishlistVariantInCart: WishlistItemsProps
) {
  const cartItemDataWithVariant = {
    cartId: cart.id,
    productId,
    variantId,
    quantity: 1,
    deleteAt: null,
  };
  await prisma.cartItems.create({
    data: cartItemDataWithVariant,
  });

  if (articleInWishlistVariantInCart) {
    await deleteItemFromWishlist(articleInWishlistVariantInCart);
  }

  revalidatePath("/wishlist");
}

//Add Item From Cart Without Variant
async function handleAddToCartWithoutVariant(
  cart: CartProps,
  productId: string,
  articleInWishlistInCart: WishlistItemsProps | undefined
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
export async function deleteItemFromWishlist(item: WishlistItemsProps) {
  await prisma.wishlistItems.update({
    where: {
      id: item.id,
    },
    data: { deleteAt: new Date() },
  });
}
