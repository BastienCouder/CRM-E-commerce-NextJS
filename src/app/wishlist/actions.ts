"use server";
import { createCart, getCart } from "@/lib/db/cart";
import { deleteLike, getLike } from "@/lib/db/like";
import { prisma } from "@/lib/db/prisma";
import { createWishlist, getWishlist } from "@/lib/db/wishlist";
import { revalidatePath } from "next/cache";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function AddToCart(productId: string, variantId: string | null) {
  // Get the user's session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const wishlist = (await getWishlist()) ?? (await createWishlist());
  const articleInWishlistVariant = wishlist.wishlistItems.find(
    (item) => item.productId === productId && item.variantId === variantId
  );
  const articleInWishlist = wishlist.wishlistItems.find(
    (item) => item.productId === productId
  );
  const cart = (await getCart()) ?? (await createCart());

  if (articleInWishlist) {
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

    if (userId) {
      const likedProductId = variantId || productId;
      const like = await getLike(userId, likedProductId);

      if (like) {
        await deleteLike(like.id);
      }
    }
    if (articleInWishlist) {
      await prisma.wishlistItems.delete({
        where: {
          id: articleInWishlist.id,
        },
      });
    }
    revalidatePath("/wishlist");
  } else {
    return;
  }
}
