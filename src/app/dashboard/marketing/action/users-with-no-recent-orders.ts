"use server ";

import { UserProps } from "@/lib/db/user";
import { prisma } from "@/lib/prisma";
import { subWeeks } from "date-fns";

export async function findUsersWithRecentCart(
  weeksAgo: number
): Promise<UserProps[]> {
  const dateLimit = subWeeks(new Date(), weeksAgo);

  const users = await prisma.user.findMany({
    where: {
      deleteAt: null,
      Cart: {
        some: {
          cartItems: {
            some: {
              createdAt: {
                gt: dateLimit,
              },
              deleteAt: null,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Cart: {
        include: {
          cartItems: {
            where: {
              deleteAt: null,
            },
            include: { product: true },
          },
        },
      },
    },
  });

  return users;
}
