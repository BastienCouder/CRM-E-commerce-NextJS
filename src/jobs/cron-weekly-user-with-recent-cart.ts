import { CartProps } from "@/lib/db/cart";
import { UserProps } from "@/lib/db/user";
import { sendEmail } from "@/lib/email/auth";
import { inngestClient } from "@/lib/inngestClient";
import { prisma } from "@/lib/prisma";
import { CartItem } from "@/schemas/DbSchema";
import { subWeeks } from "date-fns";

const cronWeeklyUsersWithRecentCartEmailsJob = inngestClient.createFunction(
  { id: "Users With Recent Cart" },
  { cron: "TZ=Europe/Paris 0 0 * * 6,0" },
  async ({ step }) => {
    const WeeksAgo = subWeeks(new Date(), 1);

    const usersWithRecentCart: UserProps[] = await step.run(
      "Get Users with recent cart",
      async () =>
        await prisma.user.findMany({
          where: {
            deleteAt: null,
            Cart: {
              some: {
                cartItems: {
                  some: {
                    createdAt: {
                      gt: WeeksAgo,
                    },
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
        })
    );

    for (const user of usersWithRecentCart) {
      const cartItems: CartItem[] =
        user.Cart?.flatMap((cart: CartProps) => cart.cartItems) || [];
      await sendEmail(user.email!, cartItems);
    }

    return { count: usersWithRecentCart.length };
  }
);

export default cronWeeklyUsersWithRecentCartEmailsJob;
