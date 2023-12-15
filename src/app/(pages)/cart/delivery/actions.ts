"use server";
import {
  DeliveryItemsProps,
  DeliveryProps,
  createDelivery,
  getDelivery,
} from "@/lib/db/delivery";
import { validateEmail } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function useServerDeliveryForm(
  formData: FormData,
  deliveryOption: string
) {
  const delivery = (await getDelivery()) ?? (await createDelivery());
  validateAndCreateDeliveryItem(delivery, formData, deliveryOption);
  revalidatePath("/cart/delivery");
}

async function validateAndCreateDeliveryItem(
  delivery: DeliveryProps,
  formData: FormData,
  deliveryOption: string
) {
  const { name, email, surname, address, postcode, city, country, tel } =
    getFormDataValues(formData);

  if (
    !name ||
    !email ||
    !surname ||
    !address ||
    !postcode ||
    !city ||
    !country ||
    !tel
  ) {
    throw new Error("Des champs sont manquants");
  }

  if (email && !validateEmail(email)) {
    throw new Error("Email invalide");
  }

  const newDeliveryItem = await prisma.deliveryItems.create({
    data: {
      delivery: {
        connect: {
          id: delivery.id,
        },
      },
      name,
      email,
      surname,
      address,
      postcode,
      city,
      country,
      tel,
      deleteAt: null,
    },
  });

  updateDefaultDeliveryItem(delivery, newDeliveryItem);
  revalidatePath("/cart/delivery");
}

async function updateDefaultDeliveryItem(
  delivery: DeliveryProps,
  newDeliveryItem: DeliveryItemsProps
) {
  const hasDefaultDelivery = await prisma.deliveryItems.findFirst({
    where: {
      deliveryId: delivery.id,
      Default: true,
    },
  });

  if (hasDefaultDelivery && hasDefaultDelivery.id !== newDeliveryItem.id) {
    await prisma.deliveryItems.update({
      where: {
        id: hasDefaultDelivery.id,
      },
      data: {
        Default: false,
      },
    });
  }
  revalidatePath("/cart/delivery");
}
export async function useServerSetDefaultDeliveryItem(deliveryItemId: string) {
  const selectedDeliveryItem = await prisma.deliveryItems.findUnique({
    where: { id: deliveryItemId },
  });

  validateSelectedDeliveryItem(selectedDeliveryItem);
  await updateDefaultDeliveryItems(selectedDeliveryItem);
  revalidatePath("/cart/delivery");
}

function validateSelectedDeliveryItem(
  selectedDeliveryItem: DeliveryItemsProps
) {
  if (!selectedDeliveryItem) {
    throw new Error("Moyen de livraison non trouvé");
  }
}

async function updateDefaultDeliveryItems(
  selectedDeliveryItem: DeliveryItemsProps
) {
  await prisma.deliveryItems.updateMany({
    where: {
      deliveryId: selectedDeliveryItem.deliveryId,
      Default: true,
    },
    data: { Default: false },
  });

  await prisma.deliveryItems.update({
    where: { id: selectedDeliveryItem.id },
    data: { Default: true },
  });
}

export async function useServerDeleteDeliveryItem(deliveryItemId: string) {
  const deliveryItem = await prisma.deliveryItems.findUnique({
    where: { id: deliveryItemId },
  });

  if (deliveryItem) {
    const { deliveryId } = deliveryItem;

    await softDeleteDeliveryItem(deliveryItemId);
    updateDefaultDelivery(deliveryId);
    revalidatePath("/cart/delivery");
  }
}

async function softDeleteDeliveryItem(deliveryItemId: string) {
  await prisma.deliveryItems.update({
    where: {
      id: deliveryItemId,
    },
    data: {
      deleteAt: new Date(),
      Default: false,
    },
  });
}

async function updateDefaultDelivery(deliveryId: string) {
  const hasDefaultDelivery = await prisma.deliveryItems.findFirst({
    where: {
      deliveryId,
      Default: false,
    },
  });

  if (hasDefaultDelivery) {
    await prisma.deliveryItems.update({
      where: {
        id: hasDefaultDelivery.id,
      },
      data: {
        Default: true,
      },
    });
  }
  revalidatePath("/cart/delivery");
}

export async function useServerUpdateDeliveryForm(
  deliveryItemId: string,
  formData: FormData
) {
  try {
    const deliveryItem = await prisma.deliveryItems.findUnique({
      where: { id: deliveryItemId },
    });

    if (!deliveryItem) {
      throw new Error("L'élément de livraison n'a pas été trouvé.");
    }

    const { name, surname, email, address, postcode, city, country, tel } =
      getFormDataValues(formData);

    await updateDeliveryItem(
      deliveryItem,
      name,
      surname,
      email,
      address,
      postcode,
      city,
      country,
      tel
    );

    revalidatePath("/cart/delivery");
    revalidatePath("/profile");
  } catch (error) {
    throw error;
  }
}

async function updateDeliveryItem(
  deliveryItem: DeliveryItemsProps,
  name: string | undefined,
  surname: string | undefined,
  email: string | undefined,
  address: string | undefined,
  postcode: string | undefined,
  city: string | undefined,
  country: string | undefined,
  tel: string | undefined
) {
  await prisma.deliveryItems.update({
    where: {
      id: deliveryItem.id,
    },
    data: {
      name,
      email,
      surname,
      address,
      postcode,
      city,
      country,
      tel,
    },
  });
}

function getFormDataValues(formData: FormData) {
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
