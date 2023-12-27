"use server";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function registerForm(formData: FormData): Promise<void> {
  const name = formData.get("username")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const hashedPassword = await bcrypt.hash(password!, 10);

  await prisma.user.create({
    data: { name, email, hashedPassword },
  });

  redirect("/profile");
}
