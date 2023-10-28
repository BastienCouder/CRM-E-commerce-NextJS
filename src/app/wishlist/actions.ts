"use server";
import { createCart, getCart } from "@/lib/db/cart";
import { deleteLike, getLike } from "@/lib/db/like";
import { prisma } from "@/lib/db/prisma";
import { createWishlist, getWishlist } from "@/lib/db/wishlist";
import { revalidatePath } from "next/cache";

export async function AddToCart(productId: string, variantId: string | null) {
  const wishlist = (await getWishlist()) ?? (await createWishlist());
  const articleInWishlist = wishlist.wishlistItems.find(
    (item) => item.productId === productId || item.variantId === variantId
  );

  const cart = (await getCart()) ?? (await createCart());

  if (articleInWishlist) {
    const cartItemDataWithVariant = {
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
      await prisma.cartItems.create({
        data: cartItemDataWithVariant,
      });
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

    await prisma.wishlistItems.delete({
      where: {
        id: articleInWishlist.id,
      },
    });

    revalidatePath("/wishlist");
  }
}
