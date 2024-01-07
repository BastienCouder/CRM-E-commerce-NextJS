"use server";
import { cookies } from "next/dist/client/components/headers";
import { prisma } from "../prisma";
import { Wishlist, WishlistItem } from "@/schemas/DbSchema";
import { currentUser } from "@/lib/auth";

export type WishlistProps = Wishlist & {
  ///...
  size: number;
};

export async function getWishlist(): Promise<WishlistProps | null> {
  const session = await currentUser();

  let wishlist: WishlistProps | null = null;

  if (session) {
    wishlist = await prisma.wishlist.findFirst({
      where: {
        userId: session.id,
      },
      include: {
        wishlistItems: {
          where: { deleteAt: null },
          include: { product: true },
        },
      },
    });
  } else {
    const localWishlistId: string | undefined =
      cookies().get("localWishlistId")?.value;
    wishlist = localWishlistId
      ? await prisma.wishlist.findUnique({
          where: { id: localWishlistId },
        })
      : null;
  }

  if (!wishlist) {
    return null;
  }

  return {
    ...wishlist,
    size: wishlist.wishlistItems?.reduce((acc: number) => acc + 1, 0),
  };
}

export async function createWishlist(): Promise<WishlistProps> {
  const session = await currentUser();

  let newWishlist: Wishlist;
  if (session) {
    newWishlist = await prisma.wishlist.create({
      data: { userId: session.id },
    });
  } else {
    newWishlist = await prisma.wishlist.create({
      data: {},
    });
  }

  cookies().set("localWishlistId", newWishlist.id);

  return {
    ...newWishlist,
    size: 0,
    wishlistItems: [],
  };
}

export async function mergeAnonymousWishlistIntoUserCart(userId: string) {
  const localWishlistId: string | undefined =
    cookies().get("localWishlistId")?.value;
  const localWishlist = localWishlistId
    ? await prisma.wishlist.findUnique({
        where: { id: localWishlistId },
        include: {
          wishlistItems: {
            include: { product: true },
          },
        },
      })
    : null;

  if (!localWishlist) {
    return;
  }

  const userWishlist = await prisma.wishlist.findFirst({
    where: { userId },
    include: {
      wishlistItems: {
        include: { product: true },
      },
    },
  });

  await prisma.$transaction(async (tx) => {
    if (userWishlist) {
      const mergedWishlistItems = mergeWishlistItems(
        localWishlist.wishlistItems,
        userWishlist.wishlistItems
      );

      await tx.wishlistItems.deleteMany({
        where: { wishlistId: userWishlist.id },
      });

      await tx.wishlistItems.createMany({
        data: mergedWishlistItems.map((item) => ({
          wishlistId: userWishlist.id,
          productId: item.productId,
          deleteAt: null,
        })),
      });
    } else {
      await tx.wishlist.create({
        data: {
          userId,
          wishlistItems: {
            createMany: {
              data: localWishlist.wishlistItems.map((item) => ({
                productId: item.productId,
                deleteAt: null,
              })),
            },
          },
        },
      });
    }
    await tx.wishlist.delete({
      where: { id: localWishlist.id },
    });

    cookies().set("localWishlistId", "");
  });
}

function mergeWishlistItems(...wishlistItems: WishlistItem[][]) {
  return wishlistItems.reduce((acc, items) => {
    items.forEach((item) => {
      acc.find((i) => i.productId === item.productId);
      acc.push(item);
    });
    return acc;
  }, [] as WishlistItem[]);
}
