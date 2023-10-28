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

  await prisma.deliveryItems.create({
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

  revalidatePath("/cart/delivery");
}
