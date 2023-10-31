"use server";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";

export async function registerForm(formData: FormData) {
  const username = formData.get("username")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const hashedPassword = await bcrypt.hash(password!, 10);

  await prisma.user.create({
    data: { username, email, hashedPassword },
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
export async function checkEmail(credentials: { email: string }) {
  const user = await prisma.user.findUnique({
    where: {
      email: credentials.email,
    },
  });

  if (!user || !user.hashedPassword) {
    return null;
  }

  return user;
}

//Check LoginPassword
export async function checkPassword(credentials: {
  email: string;
  password: string;
}) {
  const user = await checkEmail(credentials);

  if (user && user.hashedPassword) {
    const isCorrectPassword = await compare(
      credentials.password,
      user.hashedPassword
    );
    console.log(isCorrectPassword);

    return isCorrectPassword;
  }

  return false;
}
