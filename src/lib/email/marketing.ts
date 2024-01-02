import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function sendSubscribeToNewsletter(formData: FormData) {
  const session = await auth();

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
