"use server";
import { createCart, getCart } from "@/lib/db/cart";
import { deleteLike, getLike } from "@/lib/db/like";
import { prisma } from "@/lib/db/prisma";
import { createWishlist, getWishlist } from "@/lib/db/wishlist";
import { revalidatePath } from "next/cache";

export async function AddToCart(productId: string, variantId: string | null) {
  const wishlist = (await getWishlist()) ?? (await createWishlist());

  const articleInWishlistVariantInCart = wishlist.wishlistItems.find(
    (item) => item.variantId === variantId && item.productId === productId
  );
  const articleInWishlistInCart = wishlist.wishlistItems.find(
    (item) => item.productId === productId
  );

  console.log(articleInWishlistVariantInCart);

  const cart = (await getCart()) ?? (await createCart());

  if (articleInWishlistVariantInCart) {
    const cartItemDataWithVariant = {
      cartId: cart.id,
      productId,
      variantId,
      quantity: 1,
    };
    await prisma.cartItems.create({
      data: cartItemDataWithVariant,
    });

    const likedProductId = variantId || productId;
    const like = await getLike(likedProductId);

    if (like) {
      await deleteLike(like.id);
    }

    await prisma.wishlistItems.delete({
      where: {
        id: articleInWishlistVariantInCart?.id,
      },
    });

    revalidatePath("/wishlist");
  } else {
    const cartItemData = {
      cartId: cart.id,
      productId,
      quantity: 1,
    };
    await prisma.cartItems.create({
      data: cartItemData,
    });

    await prisma.wishlistItems.delete({
      where: {
        id: articleInWishlistInCart?.id,
      },
    });

    revalidatePath("/wishlist");
  }
}
