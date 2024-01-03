"use server ";

import { UserProps } from "@/lib/db/user";
import { prisma } from "@/lib/prisma";
import { subWeeks } from "date-fns";

export async function getUsersWithNoRecentOrderItems(): Promise<
  UserProps[] | null
> {
  try {
    const twoWeeksAgo = subWeeks(new Date(), 2);

    const users = await prisma.user.findMany({
      where: {
        deleteAt: null,
        Order: {
          some: {
            orderItems: {
              some: {
                createdAt: {
                  lt: twoWeeksAgo,
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error(
      "Error while retrieving users with no recent order items:",
      error
    );
    return null;
  }
}
