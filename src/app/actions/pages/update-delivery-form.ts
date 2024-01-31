import { prisma } from "@/lib/prisma";
import { DeliveryItem } from "@/schemas/db-schema";
import { revalidatePath } from "next/cache";

export async function updateDeliveryFormData(
  deliveryItemId: string,
  formData: FormData
): Promise<void> {
  const deliveryItem = await prisma.deliveryItems.findUnique({
    where: { id: deliveryItemId },
  });

  if (!deliveryItem) {
    throw new Error("Delivery item not found");
  }

  const formDataValues = extractFormDataValues(formData);
  await updateDeliveryItem(deliveryItem, formDataValues);

  revalidatePath("/cart/delivery");
  revalidatePath("/profile");
}

async function updateDeliveryItem(
  deliveryItem: DeliveryItem,
  formDataValues: any
): Promise<void> {
  await prisma.deliveryItems.update({
    where: { id: deliveryItem.id },
    data: { ...formDataValues },
  });
}

function extractFormDataValues(formData: FormData) {
  return {
    name: formData.get("name")?.toString(),
    surname: formData.get("surname")?.toString(),
    email: formData.get("email")?.toString(),
    address: formData.get("address")?.toString(),
    postcode: formData.get("postcode")?.toString(),
    city: formData.get("city")?.toString(),
    country: formData.get("country")?.toString(),
    tel: formData.get("tel")?.toString(),
  };
}
