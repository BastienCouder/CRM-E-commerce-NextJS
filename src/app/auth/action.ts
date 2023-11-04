"use server";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";

export async function registerForm(formData: FormData) {
  const name = formData.get("username")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const hashedPassword = await bcrypt.hash(password!, 10);

  await prisma.user.create({
    data: { name, email, hashedPassword },
  });

  redirect("/profile");
}

//Check RegisterEmail
export async function checkIfEmailExists(email: string) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return !!existingUser;
}

//Check LoginEmail
export async function checkEmail(email: { email: string }) {
  const user = await prisma.user.findUnique({
    where: {
      email: email.email,
    },
  });

  if (!user || !user.hashedPassword) {
    return null;
  }

  return user;
}

//Check LoginPassword
export async function checkPassword(email: {
  email: string;
  password: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.email,
      },
    });

    if (user && user.hashedPassword) {
      const isCorrectPassword = await compare(
        email.password,
        user.hashedPassword
      );

      return isCorrectPassword;
    }

    return false;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la vérification du mot de passe :",
      error
    );
    return false;
  }
}
