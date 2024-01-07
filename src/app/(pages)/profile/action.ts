"use server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateUser(formData: FormData) {
  const session = await currentUser();
  if (!session) {
    return;
  }

  const name = formData.get("surname")?.toString();
  const email = formData.get("email")?.toString();

  if (!name && !email) {
    return;
  }

  await prisma.user.update({
    where: {
      id: session.id,
    },
    data: {
      name,
      email,
    },
  });

  redirect("/profile");
}
