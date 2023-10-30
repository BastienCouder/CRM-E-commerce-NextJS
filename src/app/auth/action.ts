"use server";
import { validateEmail } from "@/lib/utils";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function registerForm(formData: FormData) {
  "use server";
  const username = formData.get("username")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!username || !email || !password)
    throw Error("Nom, adresse e-mail et mot de passe requis");

  if (email && !validateEmail(email)) {
    throw Error("Email invalide");
  }

  if (password.length < 8) {
    throw Error("Le mot de passe doit contenir plus de 8 caractères.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw Error("L'email est déjà utilisé");
  }

  const hashedPassword = await bcrypt.hash(password!, 10);

  await prisma.user.create({
    data: { username, email, hashedPassword },
  });

  redirect("/profile");
}
