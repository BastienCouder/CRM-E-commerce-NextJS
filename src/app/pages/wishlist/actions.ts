"use server";
import { ShoppingCart, createCart, getCart } from "@/lib/db/cart";
import { deleteLike, getLike } from "@/lib/db/like";
import { prisma } from "@/lib/db/prisma";
import { createWishlist, getWishlist } from "@/lib/db/wishlist";
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
  await handleLikeDeletion(variantId, productId);
}

//Add Item From Cart With Variant
async function handleAddToCartWithVariant(
  cart: ShoppingCart,
  productId: string,
  variantId: string | null,
  articleInWishlistVariantInCart: any
) {
  const cartItemDataWithVariant = {
    cartId: cart.id,
    productId,
    variantId,
    quantity: 1,
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
  cart: ShoppingCart,
  productId: string,
  articleInWishlistInCart: any
) {
  const cartItemData = {
    cartId: cart.id,
    productId,
    quantity: 1,
  };
  await prisma.cartItems.create({
    data: cartItemData,
  });

  if (articleInWishlistInCart) {
    await prisma.wishlistItems.delete({
      where: {
        id: articleInWishlistInCart?.id,
      },
    });
  }

  revalidatePath("/wishlist");
}

//Delete Item From Whishlist
export async function deleteItemFromWishlist(item: any) {
  await prisma.wishlistItems.delete({
    where: {
      id: item.id,
    },
  });
}

//Delete Like
async function handleLikeDeletion(variantId: string | null, productId: string) {
  const likedProductId = variantId || productId;
  const like = await getLike(likedProductId);

  if (like) {
    await deleteLike(like.id);
  }
}