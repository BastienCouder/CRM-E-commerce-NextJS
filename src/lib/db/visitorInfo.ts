"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { VisitorInfo } from "@/lib/DbSchema";

export type VisitorInfoProps = VisitorInfo & {
  ///
};
export async function getVisitorInfo(): Promise<VisitorInfoProps[] | null> {
  const session = await getServerSession(authOptions);

  if (session && session.user.role === "admin") {
    try {
      const visitorInfo = await prisma.visitorInfo.findMany();

      return visitorInfo;
    } catch (error: any) {
      throw new Error(`Error while retrieving users: ${error.message}`);
    }
  } else {
    throw new Error("Error: Unauthorized user");
  }
}
