"use server";

import { revalidatePath } from "next/cache";

export async function designateDefaultDeliveryItem(
  deliveryItemId: string
): Promise<void> {
  const selectedDeliveryItem = await prisma.deliveryItems.findUnique({
    where: { id: deliveryItemId },
  });

  if (!selectedDeliveryItem) {
    throw new Error("Delivery item not found");
  }

  await setDefaultDeliveryItem(selectedDeliveryItem.deliveryId, deliveryItemId);
  revalidatePath("/cart/delivery");
}

async function setDefaultDeliveryItem(
  deliveryId: string,
  deliveryItemId: string
): Promise<void> {
  await prisma.deliveryItems.updateMany({
    where: { deliveryId, Default: true },
    data: { Default: false },
  });
  await prisma.deliveryItems.update({
    where: { id: deliveryItemId },
    data: { Default: true },
  });
}
