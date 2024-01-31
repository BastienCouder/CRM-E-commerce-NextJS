"use server";
import { prisma } from "@/lib/prisma";
import { WishlistItem } from "@/schemas/db-schema";

export async function deleteFromWishlist(item: WishlistItem) {
  await prisma.wishlistItems.update({
    where: {
      id: item.id,
    },
    data: { deleteAt: new Date() },
  });
}
