import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Prisma, Like } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type ShoppingLike = {
  id: string;
  likedById: string | null;
  likedProductId: string | null;
  likedVariantId: string | null;
};

export async function createLike(
  productId: string | null,
  variantId: string | null
): Promise<ShoppingLike | null> {
  const session = await getServerSession(authOptions);
  try {
    const likeData: any = {
      likedProductId: productId,
      likedVariantId: variantId,
    };

    if (session) {
      likeData.likedById = session.user.id;
    }

    const newLike = await prisma.like.create({
      data: likeData,
    });

    if (newLike) {
      cookies().set("localLikeId", newLike.id);
      return newLike;
    }

    return null;
  } catch (error: any) {
    throw new Error("Failed to create a like: " + error.message);
  }
}
export async function deleteLike(likeId: string | null): Promise<void> {
  try {
    if (likeId) {
      await prisma.like.delete({
        where: {
          id: likeId,
        },
      });
    }
  } catch (error: any) {
    throw new Error("Failed to delete the like: " + error.message);
  }
}
// Exemple de modification de la fonction getLike pour accepter un identifiant comme argument.
export async function getLike(likeId: string): Promise<ShoppingLike | null> {
  try {
    const like = await prisma.like.findUnique({
      where: {
        id: likeId,
      },
    });

    return like;
  } catch (error: any) {
    throw new Error("Failed to read the like: " + error.message);
  }
}
