"use server";

import { DeliveryProps, createDelivery, getDelivery } from "@/lib/db/delivery";
import { prisma } from "@/lib/prisma";
import { validateEmail } from "@/lib/utils";
import { DeliveryFormSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const processDeliveryForm = async (
  values: z.infer<typeof DeliveryFormSchema>
) => {
  const delivery = (await getDelivery()) ?? (await createDelivery());
  const result = await createOrUpdateDeliveryItem(delivery, values);
  if (result.success) {
    revalidatePath("/cart/delivery");
    revalidatePath("/profile");
    return { success: "Create Form Delivery!" };
  } else {
    return { error: "Invalid form data" };
  }
};

interface CreateOrUpdateDeliveryItemResult {
  success: boolean;
}

async function createOrUpdateDeliveryItem(
  delivery: DeliveryProps,
  values: z.infer<typeof DeliveryFormSchema>
): Promise<CreateOrUpdateDeliveryItemResult> {
  if (
    !validateFormData(values) ||
    (values.email && !validateEmail(values.email))
  ) {
    return { success: false };
  } else {
    const newDeliveryItem = await prisma.deliveryItems.create({
      data: {
        delivery: { connect: { id: delivery.id } },
        name: values.name ?? "",
        surname: values.surname ?? "",
        email: values.email ?? "",
        address: values.address ?? "",
        postcode: values.postcode ?? "",
        city: values.city ?? "",
        country: values.country ?? "",
        tel: values.tel ?? "",
        deleteAt: null,
      },
    });

    await setDefaultDeliveryItem(delivery.id, newDeliveryItem.id);
    return { success: true };
  }
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
