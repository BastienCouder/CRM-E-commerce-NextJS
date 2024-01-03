"use server";

import { DeliveryProps, createDelivery, getDelivery } from "@/lib/db/delivery";
import { prisma } from "@/lib/prisma";
import { validateEmail } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function processDeliveryForm(formData: FormData): Promise<void> {
  const delivery = (await getDelivery()) ?? (await createDelivery());
  await createOrUpdateDeliveryItem(delivery, formData);
  revalidatePath("/cart/delivery");
}

async function createOrUpdateDeliveryItem(
  delivery: DeliveryProps,
  formData: FormData
): Promise<void> {
  const formDataValues = extractFormDataValues(formData);

  if (
    !validateFormData(formDataValues) ||
    (formDataValues.email && !validateEmail(formDataValues.email))
  ) {
    throw new Error("Invalid form data");
  }

  const newDeliveryItem = await prisma.deliveryItems.create({
    data: {
      delivery: { connect: { id: delivery.id } },
      name: formDataValues.name ?? "",
      surname: formDataValues.surname ?? "",
      email: formDataValues.email ?? "",
      address: formDataValues.address ?? "",
      postcode: formDataValues.postcode ?? "",
      city: formDataValues.city ?? "",
      country: formDataValues.country ?? "",
      tel: formDataValues.tel ?? "",
      deleteAt: null,
    },
  });

  await setDefaultDeliveryItem(delivery.id, newDeliveryItem.id);
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

export interface FormDataValues {
  name?: string;
  surname?: string;
  email?: string;
  address?: string;
  postcode?: string;
  city?: string;
  country?: string;
  tel?: string;
}

function validateFormData(formDataValues: FormDataValues): boolean {
  return Object.values(formDataValues).every(
    (value) => value != null && value.trim() !== ""
  );
}
