import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Prisma, Like } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type ShoppingLike = {
  id: string;
  likedById: string | null;
  likedProductId: string | null;
};

export async function createLike(
  likedProductId: string
): Promise<ShoppingLike | null> {
  const session = await getServerSession(authOptions);

  let newLike: Like;
  if (session) {
    newLike = await prisma.like.create({
      data: { likedById: session.user.id, likedProductId },
    });
  } else {
    newLike = await prisma.like.create({
      data: {},
    });
  }

  cookies().set("localLikeId", newLike.id);

  return {
    ...newLike,
  };
}

export async function deleteLike(likeId: string): Promise<void> {
  await prisma.like.delete({
    where: {
      id: likeId,
    },
  });
}

export async function getLike(productId: string): Promise<ShoppingLike | null> {
  const session = await getServerSession(authOptions);

  let like: ShoppingLike | null = null;

  if (session) {
    like = await prisma.like.findFirst({
      where: {
        likedById: session.user.id,
        likedProductId: productId,
      },
    });
  } else {
    const localLikeId = cookies().get("localLikeId")?.value;
    localLikeId
      ? await prisma.like.findFirst({
          where: {
            likedById: localLikeId,
            likedProductId: productId,
          },
        })
      : null;
  }

  if (!like) {
    return null;
  }

  return {
    ...like,
  };
}
