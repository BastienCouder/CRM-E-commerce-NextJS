import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Prisma, Wishlist, WishlistItems } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type WishlistWithProducts = Prisma.WishlistGetPayload<{
  include: {
    wishlistItems: { include: { product: true; variant: true } };
  };
}>;

export type WishlistItemWithProduct = Prisma.WishlistItemsGetPayload<{
  include: { product: true; variant: true };
}>;

export type ShoppingWishlist = WishlistWithProducts & {
  ///...
};

export async function getWishlist(): Promise<ShoppingWishlist | null> {
  const session = await getServerSession(authOptions);

  let wishlist: WishlistWithProducts | null = null;

  if (session) {
    wishlist = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        wishlistItems: { include: { product: true, variant: true } },
      },
    });
  } else {
    const localWishlistId = cookies().get("localWishlistId")?.value;
    wishlist = localWishlistId
      ? await prisma.wishlist.findUnique({
          where: { id: localWishlistId },
          include: {
            wishlistItems: {
              include: { product: true, variant: true },
            },
          },
        })
      : null;
  }

  if (!wishlist) {
    return null;
  }

  return {
    ...wishlist,
  };
}

export async function createWishlist(): Promise<ShoppingWishlist> {
  const session = await getServerSession(authOptions);

  let newWishlist: Wishlist;
  if (session) {
    newWishlist = await prisma.wishlist.create({
      data: { userId: session.user.id },
    });
  } else {
    newWishlist = await prisma.wishlist.create({
      data: {},
    });
  }

  cookies().set("localWishlistId", newWishlist.id);

  return {
    ...newWishlist,
    wishlistItems: [],
  };
}

export async function mergeAnonymousWishlistIntoUserCart(userId: string) {
  const localWishlistId = cookies().get("localWishlistId")?.value;

  const localWishlist = localWishlistId
    ? await prisma.wishlist.findUnique({
        where: { id: localWishlistId },
        include: {
          wishlistItems: { include: { product: true, variant: true } },
        },
      })
    : null;

  if (!localWishlist) {
    return;
  }

  const userWishlist = await prisma.wishlist.findFirst({
    where: { userId },
    include: { wishlistItems: { include: { product: true, variant: true } } },
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
          variantId: item.variantId,
          productId: item.productId,
        })),
      });
    } else {
      await tx.wishlist.create({
        data: {
          userId,
          wishlistItems: {
            createMany: {
              data: localWishlist.wishlistItems.map((item) => ({
                variantId: item.variantId,
                productId: item.productId,
              })),
            },
          },
        },
      });
    }
    await tx.cart.delete({
      where: { id: localWishlist.id },
    });

    cookies().set("localWishlistId", "");
  });
}

function mergeWishlistItems(...wishlistItems: WishlistItems[][]) {
  return wishlistItems.reduce((acc, items) => {
    items.forEach((item) => {
      acc.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );
      acc.push(item);
    });
    return acc;
  }, [] as WishlistItems[]);
}
