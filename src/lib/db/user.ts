"use server";
import { prisma } from "@/lib/prisma";
import { User } from "@/schemas/DbSchema";
import { utils } from "../../data/infosWebsite";
import { auth } from "@/auth";

export type UserProps = User & {
  ///
};

export async function getUsers(): Promise<UserProps[] | null> {
  const session = await auth();

  if (session && session.user.role === `${utils.protected}`) {
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
