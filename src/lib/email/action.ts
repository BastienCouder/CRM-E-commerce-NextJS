"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { revalidatePath } from "next/cache";

export async function sendSubscribeToNewsletter(formData: FormData) {
  const session = await getSession();

  if (!session) {
    throw Error("Veuillez-vous connecter");
  }

  const email = formData.get("email")?.toString();

  if (email === session.user?.email) {
    await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        newsletter: true,
      },
    });
  } else {
    throw Error("Email incorrecte");
  }
  revalidatePath("/");
}
