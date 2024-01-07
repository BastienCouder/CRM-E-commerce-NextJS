"use server";

import { revalidatePath } from "next/cache";

export async function removeDeliveryItem(
  deliveryItemId: string
): Promise<void> {
  const deliveryItem = await prisma.deliveryItems.findUnique({
    where: { id: deliveryItemId },
  });

  if (deliveryItem) {
    await softDeleteDeliveryItem(deliveryItemId);
    await designateNextDefaultDeliveryItem(deliveryItem.deliveryId);
  }
}

async function softDeleteDeliveryItem(deliveryItemId: string): Promise<void> {
  await prisma.deliveryItems.update({
    where: { id: deliveryItemId },
    data: { deleteAt: new Date(), Default: false },
  });
}

async function designateNextDefaultDeliveryItem(
  deliveryId: string
): Promise<void> {
  const nextDefaultItem = await prisma.deliveryItems.findFirst({
    where: { deliveryId, Default: false },
  });

  if (nextDefaultItem) {
    await prisma.deliveryItems.update({
      where: { id: nextDefaultItem.id },
      data: { Default: true },
    });
  }

  revalidatePath("/cart/delivery");
  revalidatePath("/profile");
}
