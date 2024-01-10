"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CartProps, createCart, getCart } from "@/lib/db/cart";
import { WishlistProps, createWishlist, getWishlist } from "@/lib/db/wishlist";
import { CartItem, WishlistItem } from "@/schemas/db-schema";

export async function addProductToWishlist(productId: string): Promise<void> {
  const cart: CartProps | null = (await getCart()) ?? (await createCart());
  const wishlist: WishlistProps | null =
    (await getWishlist()) ?? (await createWishlist());

  const productInCart: CartItem = cart.cartItems.find(
    (item: CartItem) => item.productId === productId
  );
  const productInWishlist: WishlistItem = wishlist.wishlistItems.find(
    (item: WishlistItem) => item.productId === productId
  );

  if (!productInCart) {
    if (productInWishlist) {
      await removeProductFromWishlist(productInWishlist);
    } else {
      await createNewWishlistItem(wishlist, productId);
    }
  }

  revalidatePath(`/products/${productId}`);
}

export async function removeProductFromWishlist(
  productInWishlist: WishlistItem
): Promise<void> {
  await prisma.wishlistItems.update({
    where: { id: productInWishlist.id },
    data: { deleteAt: new Date() },
  });
}

async function createNewWishlistItem(
  wishlist: WishlistProps,
  productId: string
): Promise<void> {
  await prisma.wishlistItems.create({
    data: {
      wishlistId: wishlist.id,
      productId,
      deleteAt: null,
    },
  });
}
