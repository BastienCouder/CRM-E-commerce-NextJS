"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function useServersubscribeToNewsletter(formData: FormData) {
  const session = await getServerSession(authOptions);
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
