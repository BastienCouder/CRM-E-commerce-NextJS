"use server";
import { createDelivery, getDelivery } from "@/lib/db/delivery";
import { validateEmail } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function deliveryForm(formData: FormData) {
  const delivery = (await getDelivery()) ?? (await createDelivery());

  const name = formData.get("name")?.toString();
  const surname = formData.get("surname")?.toString();
  const email = formData.get("email")?.toString();
  const address = formData.get("address")?.toString();
  const postcode = formData.get("postcode")?.toString();
  const city = formData.get("city")?.toString();
  const country = formData.get("country")?.toString();
  const tel = formData.get("tel")?.toString();

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
    },
  });

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

export async function setDefaultDeliveryItem(deliveryItemId: string) {
  const selectedDeliveryItem = await prisma.deliveryItems.findUnique({
    where: { id: deliveryItemId },
  });

  if (!selectedDeliveryItem) {
    throw new Error("Moyen de livraison non trouvé");
  }
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

  revalidatePath("/cart/delivery");
}

export async function DeleteDeliveryItem(deliveryItemId: string) {
  const deliveryItem = await prisma.deliveryItems.findUnique({
    where: { id: deliveryItemId },
  });

  if (deliveryItem) {
    const { deliveryId } = deliveryItem;

    await prisma.deliveryItems.update({
      where: {
        id: deliveryItemId,
      },
      data: {
        SoftDelete: true,
        Default: false,
      },
    });

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
  }

  revalidatePath("/cart/delivery");
}
export async function UpdateDeliveryForm(
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
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const postcode = formData.get("postcode") as string;
    const city = formData.get("city") as string;
    const country = formData.get("country") as string;
    const tel = formData.get("tel") as string;

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

    revalidatePath("/cart/delivery");
  } catch (error) {
    throw error;
  }
}
