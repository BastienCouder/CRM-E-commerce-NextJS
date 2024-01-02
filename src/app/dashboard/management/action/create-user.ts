"use server";

import { UserRole, UserRoleEnum } from "@/schemas/DbSchema";

export async function sendCreateUser(formData: FormData): Promise<void> {
  const name = formData.get("username")?.toString();
  const email = formData.get("email")?.toString();
  let role: UserRole | undefined;
  const formRole = formData.get("role")?.toString();
  const parsedRole = UserRoleEnum.safeParse(formRole);

  if (parsedRole.success) {
    role = parsedRole.data;
    console.log(role);
  } else {
    throw new Error(`Rôle invalide fourni: ${formRole}`);
  }

  await prisma.user.create({
    data: {
      name,
      email,
      image: null,
      role,
      emailVerified: null,
      newsletter: null,
    },
  });
}
