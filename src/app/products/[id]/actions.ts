"use server";

import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function incrementProductQuantity(
  productId: string,
  variantId: string | null
) {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.cartItems.find(
    (item) => item.productId === productId && item.variantId === variantId
  );
  if (articleInCart) {
    await prisma.cartItems.update({
      where: {
        id: articleInCart.id,
      },
      data: { quantity: { increment: 1 } },
    });
  } else {
    if (variantId) {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          variants: {
            where: {
              id: variantId,
            },
          },
        },
      });
    }

    await prisma.cartItems.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || "000000000000000000000000",
        quantity: 1,
      },
    });
  }

  revalidatePath("/products/[id]");
}

import { createWishlist, getWishlist } from "@/lib/db/wishlist";
import { createLike, deleteLike, getLike } from "@/lib/db/like";
export async function incrementWishlist(
  productId: string,
  variantId: string | null,
  userId: string
) {
  const wishlist = (await getWishlist()) ?? (await createWishlist());

  const articleInWishlist = wishlist.wishlistItems.find(
    (item) => item.productId === productId && item.variantId === variantId
  );

  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.cartItems.find(
    (item) => item.productId === productId && item.variantId === variantId
  );
  const likedProductId = variantId || productId;

  const like = await getLike(userId, likedProductId);

  if (variantId) {
    await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        variants: {
          where: {
            id: variantId,
          },
        },
      },
    });
  }
  if (articleInWishlist) {
    await prisma.wishlistItems.delete({
      where: {
        id: articleInWishlist.id,
      },
    });

    if (like) {
      await deleteLike(like.id);
    }
  } else if (articleInCart) {
    return;
  } else {
    await prisma.wishlistItems.create({
      data: {
        wishlistId: wishlist.id,
        productId,
        variantId,
        quantity: 1,
      },
    });

    await createLike(userId, productId, variantId);
  }

  revalidatePath(`/products/${productId}`);
}
