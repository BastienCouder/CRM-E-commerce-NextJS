"use server";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

import { createCart, getCart } from "@/lib/db/cart";
import { createWishlist, getWishlist } from "@/lib/db/wishlist";
import { createLike, deleteLike, getLike } from "@/lib/db/like";

export async function incrementProductQuantity(
  productId: string,
  variantId: string | null
) {
  const cart = (await getCart()) ?? (await createCart());
  const articleInCartWithVariant = cart.cartItems.find(
    (item) => item.variantId === variantId && item.productId === productId
  );
  const articleInCart = cart.cartItems.find(
    (item) => item.productId === productId
  );
  const wishlist = (await getWishlist()) ?? (await createWishlist());
  const articleInWishlist = wishlist.wishlistItems.find(
    (item) => item.productId === productId || item.variantId === variantId
  );

  if (articleInCartWithVariant) {
    await prisma.cartItems.update({
      where: {
        id: articleInCartWithVariant.id,
      },
      data: { quantity: { increment: 1 } },
    });
    revalidatePath(`/products/${productId}`);
  } else {
    if (articleInCart) {
      await prisma.cartItems.update({
        where: {
          id: articleInCart.id,
        },
        data: { quantity: { increment: 1 } },
      });
      revalidatePath(`/products/${productId}`);
    } else {
      const cartItemDataVariant = {
        cartId: cart.id,
        productId,
        variantId,
        quantity: 1,
      };
      const cartItemData = {
        cartId: cart.id,
        productId,
        quantity: 1,
      };

      if (variantId) {
        const productVariant = await prisma.productVariant.findUnique({
          where: {
            id: variantId,
          },
        });
        if (productVariant) {
          await prisma.cartItems.create({
            data: cartItemDataVariant,
          });
        }
      } else {
        await prisma.cartItems.create({
          data: cartItemData,
        });
      }

      const likedProductId = variantId || productId;
      const like = await getLike(likedProductId);
      if (like) {
        await deleteLike(like.id);
      }

      if (articleInWishlist) {
        await prisma.wishlistItems.delete({
          where: {
            id: articleInWishlist.id,
          },
        });
      }

      revalidatePath(`/products/${productId}`);
    }
  }
}

export async function incrementWishlist(
  productId: string,
  variantId: string | null
) {
  const cart = (await getCart()) ?? (await createCart());
  const articleInCart = cart.cartItems.find(
    (item) => item.variantId === variantId && item.productId === productId
  );

  const wishlist = (await getWishlist()) ?? (await createWishlist());
  const articleInWishlist = wishlist.wishlistItems.find(
    (item) => item.productId === productId && item.variantId === variantId
  );

  const likedProductId = variantId || productId;
  const like = await getLike(likedProductId);

  if (articleInCart) {
    return;
  } else {
    if (articleInWishlist) {
      await prisma.wishlistItems.delete({
        where: {
          id: articleInWishlist.id,
        },
      });

      if (like) {
        await deleteLike(like.id);
      }
    } else {
      await prisma.wishlistItems.create({
        data: {
          wishlistId: wishlist.id,
          productId,
          variantId,
        },
      });

      await createLike(likedProductId);
    }
  }
  revalidatePath(`/products/${productId}`);
}
