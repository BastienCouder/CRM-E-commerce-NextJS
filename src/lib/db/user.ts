"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkUserRole } from "@/middlewares/Admin";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";

export type UserProps = User & {
  ///
};
export async function getUsers(): Promise<UserProps[] | null> {
  const session = await getServerSession(authOptions);
  const admin = await checkUserRole();

  if (!admin) {
    try {
      const users = await prisma.user.findMany({
        where: { deleteAt: null || undefined },
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
