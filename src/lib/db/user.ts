"use server";
import { prisma } from "@/lib/prisma";
import { User } from "@/schemas/DbSchema";
import { currentUser, roleCheckMiddleware } from "../auth";

export type UserProps = User & {
  ///
};

export async function getUsers(): Promise<UserProps[] | null> {
  const session = await currentUser();
  const isAuthorized = roleCheckMiddleware(session);

  if (isAuthorized) {
    try {
      const users = await prisma.user.findMany({
        where: { deleteAt: null || undefined },
        orderBy: {
          createdAt: "desc",
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

export async function getUsersNewsletter(): Promise<UserProps[] | null> {
  const session = await currentUser();
  const isAuthorized = roleCheckMiddleware(session);

  if (isAuthorized) {
    try {
      const users = await prisma.user.findMany({
        where: {
          deleteAt: null,
          newsletter: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return users;
    } catch (error) {
      console.error("Error while retrieving newsletter users:", error);
      return null;
    }
  } else {
    console.error("Error: Unauthorized user");
    return null;
  }
}
