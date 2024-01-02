"use server";
import { revalidatePath } from "next/cache";
import { DeliveryProps, createDelivery, getDelivery } from "@/lib/db/delivery";
import { validateEmail } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { DeliveryItem } from "@/schemas/DbSchema";

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
}

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
