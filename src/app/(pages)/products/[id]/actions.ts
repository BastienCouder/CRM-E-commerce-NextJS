"use server";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { CartProps, createCart, getCart } from "@/lib/db/cart";
import { WishlistProps, createWishlist, getWishlist } from "@/lib/db/wishlist";
import { deleteItemFromWishlist } from "@/app/(pages)/wishlist/actions";
import { CartItem, WishlistItem } from "@/lib/DbSchema";

export async function addProductToCart(productId: string): Promise<void> {
  const cart: CartProps | null = (await getCart()) ?? (await createCart());
  const wishlist: WishlistProps | null =
    (await getWishlist()) ?? (await createWishlist());

  const productInCart: CartItem | undefined = cart.cartItems.find(
    (item: CartItem) => item.productId === productId
  );
  const productInWishlist: WishlistItem | undefined =
    wishlist.wishlistItems.find(
      (item: WishlistItem) => item.productId === productId
    );

  if (productInCart) {
    await updateCartItemQuantity(productId, productInCart);
  } else {
    await createNewCartItem(cart, productId, productInWishlist);
    revalidatePath(`/products/${productId}`);
  }
}

async function createNewCartItem(
  cart: CartProps,
  productId: string,
  productInWishlist: WishlistItem | undefined
): Promise<void> {
  const newCartItem = {
    cartId: cart.id,
    productId,
    quantity: 1,
    deleteAt: null,
  };
  await prisma.cartItems.create({ data: newCartItem });

  if (productInWishlist) {
    await deleteItemFromWishlist(productInWishlist);
  }

  revalidatePath(`/products/${productId}`);
  revalidatePath("/wishlist");
}

async function updateCartItemQuantity(
  productId: string,
  productInCart: CartItem
): Promise<void> {
  await prisma.cartItems.update({
    where: { id: productInCart.id },
    data: { quantity: { increment: 1 } },
  });
  revalidatePath(`/products/${productId}`);
}

export async function addProductToWishlist(productId: string): Promise<void> {
  const cart: CartProps | null = (await getCart()) ?? (await createCart());
  const wishlist: WishlistProps | null =
    (await getWishlist()) ?? (await createWishlist());

  const productInCart: CartItem | undefined = cart.cartItems.find(
    (item: CartItem) => item.productId === productId
  );
  const productInWishlist: WishlistItem | undefined =
    wishlist.wishlistItems.find(
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

async function removeProductFromWishlist(
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
