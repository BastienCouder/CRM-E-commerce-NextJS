"use server";
import { prisma } from "@/lib/prisma";
import { User } from "@/schemas/DbSchema";
import { auth } from "@/auth";
import { roleCheckMiddleware } from "../auth";

export type UserProps = User & {
  ///
};

export async function getUsers(): Promise<UserProps[] | null> {
  const session = await auth();
  const response = roleCheckMiddleware(session);

  if (session && response) {
    try {
      const users = await prisma.user.findMany({
        where: { deleteAt: null || undefined },
        orderBy: {
          id: "desc",
        },
      });

      return users;
    } catch (error) {
      console.error("Error while retrieving users:", error);
      return null;
    }
  } else {
    console.error("Error: Unauthorized user");
    return null;
  }
}
