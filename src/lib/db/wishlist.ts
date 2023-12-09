import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Prisma, Wishlist, WishlistItems } from "@prisma/client";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type WishlistWithWishlistItemsProps = Prisma.WishlistGetPayload<{
  include: {
    wishlistItems: { include: { product: true; variant: true } };
  };
}>;

export type WishlistItemsProps = Prisma.WishlistItemsGetPayload<{
  include: { product: true; variant: true };
}>;

export type WishlistProps = WishlistWithWishlistItemsProps & {
  ///...
  size: number;
};

export async function getWishlist(): Promise<WishlistProps | null> {
  const session: Session | null = await getServerSession(authOptions);

  let wishlist: WishlistWithWishlistItemsProps | null = null;

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
    const localWishlistId: string | undefined =
      cookies().get("localWishlistId")?.value;
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
    size: wishlist.wishlistItems.reduce((acc) => acc + 1, 0),
  };
}

export async function createWishlist(): Promise<WishlistProps> {
  const session: Session | null = await getServerSession(authOptions);

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
    await tx.wishlist.delete({
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
