"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function updateUser(formData: FormData) {
  const session = await getServerSession(authOptions);
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
      id: session.user?.id,
    },
    data: {
      name,
      email,
    },
  });

  redirect("/profile");
}
