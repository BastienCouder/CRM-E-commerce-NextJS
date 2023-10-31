"use server";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

import { ShoppingCart, createCart, getCart } from "@/lib/db/cart";
import { createWishlist, getWishlist } from "@/lib/db/wishlist";
import { deleteItemFromWishlist } from "../../wishlist/actions";
export async function useServerAddToCart(
  productId: string,
  variantId: string | null
) {
  //DB REST
  const cart = (await getCart()) ?? (await createCart());
  const wishlist = (await getWishlist()) ?? (await createWishlist());

  //Find Method
  //cart
  const articleInCartWithVariant = cart.cartItems.find(
    (item) => item.productId === productId && item.variantId === variantId
  );
  const articleInCart = cart.cartItems.find(
    (item) => item.productId === productId
  );

  //cart
  const articleInWishlistVariant = wishlist.wishlistItems.find(
    (item) => item.variantId === variantId && item.productId === productId
  );
  const articleInWishlist = wishlist.wishlistItems.find(
    (item) => item.productId === productId
  );

  //Global Function
  if (articleInCartWithVariant) {
    await handleUpdateToCartWithVariant(productId, articleInCartWithVariant);
  } else if (variantId) {
    await handleAddToCartWithVariant(
      cart,
      productId,
      variantId,
      articleInWishlistVariant
    );

    revalidatePath(`/products/${productId}`);
  } else {
    if (articleInCart) {
      await handleUpdateToCartWithoutVariant(productId, articleInCart);
    } else {
      await handleAddToCartWithoutVariant(cart, productId, articleInWishlist);

      revalidatePath(`/products/${productId}`);
    }
  }

  //Add To Cart With Variant
  async function handleAddToCartWithVariant(
    cart: ShoppingCart,
    productId: string,
    variantId: string | null,
    articleInWishlistVariant: any
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

    if (articleInWishlistVariant) {
      await deleteItemFromWishlist(articleInWishlistVariant);
    }

    revalidatePath(`/products/${productId}`);
    revalidatePath("/wishlist");
  }

  //Add To Cart Without Variant
  async function handleAddToCartWithoutVariant(
    cart: ShoppingCart,
    productId: string,
    articleInWishlist: any
  ) {
    const cartItemDataWithVariant = {
      cartId: cart.id,
      productId,
      quantity: 1,
    };
    await prisma.cartItems.create({
      data: cartItemDataWithVariant,
    });

    if (articleInWishlist) {
      await deleteItemFromWishlist(articleInWishlist);
    }

    revalidatePath(`/products/${productId}`);
    revalidatePath("/wishlist");
  }

  //Update To Cart With Variant
  async function handleUpdateToCartWithVariant(
    productId: string,
    articleInCartWithVariant: any
  ) {
    await prisma.cartItems.update({
      where: {
        id: articleInCartWithVariant.id,
      },
      data: { quantity: { increment: 1 } },
    });
    revalidatePath(`/products/${productId}`);
  }

  //Update To Cart Without Variant
  async function handleUpdateToCartWithoutVariant(
    productId: string,
    articleInCart: any
  ) {
    await prisma.cartItems.update({
      where: {
        id: articleInCart.id,
      },
      data: { quantity: { increment: 1 } },
    });
    revalidatePath(`/products/${productId}`);
  }
}

export async function useServerAddWishlist(
  productId: string,
  variantId: string | null
) {
  //DB REST
  const cart = (await getCart()) ?? (await createCart());
  const wishlist = (await getWishlist()) ?? (await createWishlist());

  //Find Method
  const articleInCart = cart.cartItems.find(
    (item) => item.variantId === variantId && item.productId === productId
  );
  const articleInWishlist = wishlist.wishlistItems.find(
    (item) => item.productId === productId && item.variantId === variantId
  );

  //global Function
  if (articleInCart) {
    return;
  } else {
    if (articleInWishlist) {
      await handleDeleteFromWishlist(articleInWishlist);
    } else {
      await handleAddToWishlist(wishlist, productId, variantId);
    }
  }

  revalidatePath(`/products/${productId}`);
}

//Delete To WishList
async function handleDeleteFromWishlist(articleInWishlist: any) {
  await prisma.wishlistItems.delete({
    where: {
      id: articleInWishlist.id,
    },
  });
}

//Add To WishList
async function handleAddToWishlist(
  wishlist: any,
  productId: string,
  variantId: string | null
) {
  await prisma.wishlistItems.create({
    data: {
      wishlistId: wishlist.id,
      productId,
      variantId,
    },
  });
}
