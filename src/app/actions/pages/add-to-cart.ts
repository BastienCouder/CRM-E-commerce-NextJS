"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CartProps, createCart, getCart } from "@/lib/db/cart";
import { CartItem, WishlistItem } from "@/schemas/db-schema";
import { WishlistProps, createWishlist, getWishlist } from "@/lib/db/wishlist";
import { removeProductFromWishlist } from "./add-to-wishlist";

export async function addProductToCart(productId: string): Promise<void> {
  const cart: CartProps | null = (await getCart()) ?? (await createCart());
  const wishlist: WishlistProps | null =
    (await getWishlist()) ?? (await createWishlist());

  const productInCart: CartItem | undefined = cart.cartItems.find(
    (item: CartItem) => item.productId === productId
  );
  const productInWishlist: WishlistItem = wishlist.wishlistItems.find(
    (item: WishlistItem) => item.productId === productId
  );

  if (productInCart) {
    await updateCartItemQuantity(productInCart);
  } else {
    await createNewCartItem(cart, productId);
  }
  if (productInWishlist) {
    await removeProductFromWishlist(productInWishlist);
  }
  revalidatePath(`/products/${productId}`);
  revalidatePath("/wishlist");
}

async function createNewCartItem(
  cart: CartProps,
  productId: string
): Promise<void> {
  const newCartItem = {
    cartId: cart.id,
    productId,
    quantity: 1,
    deleteAt: null,
  };
  await prisma.cartItems.create({ data: newCartItem });
}

async function updateCartItemQuantity(productInCart: CartItem): Promise<void> {
  await prisma.cartItems.update({
    where: { id: productInCart.id },
    data: { quantity: { increment: 1 } },
  });
}
