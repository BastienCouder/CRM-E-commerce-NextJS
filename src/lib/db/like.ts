import { prisma } from "./prisma";
import { Like } from "@prisma/client";

export async function createLike(
  userId: string,
  productId: string,
  variantId: string | null
): Promise<Like> {
  const likedProductId = variantId ? variantId : productId;

  const like = await prisma.like.create({
    data: {
      likedById: userId,
      likedProductId,
    },
  });

  return like;
}
export async function deleteLike(likeId: string): Promise<void> {
  await prisma.like.delete({
    where: {
      id: likeId,
    },
  });
}

export async function getLike(
  userId: string,
  productId: string
): Promise<Like | null> {
  const like = await prisma.like.findFirst({
    where: {
      likedById: userId,
      likedProductId: productId,
    },
  });
  console.log(like);

  return like;
}
