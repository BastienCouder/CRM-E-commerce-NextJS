import website from "@/lib/data/infosWebsite";
import { CartProps } from "@/lib/db/cart";
import { CronProps, getCrons } from "@/lib/db/crons";
import { UserProps } from "@/lib/db/user";
import { sendEmail } from "@/lib/email/auth";
import { inngestClient } from "@/lib/inngestClient";
import { prisma } from "@/lib/prisma";
import { CartItem } from "@/schemas/DbSchema";
import { subWeeks } from "date-fns";

const crons: CronProps = getCrons();
const currentCron = crons.find(
  (cron: CronProps) => cron === `${cron.cronWeeklyUsersWithRecentCart}`
);
const cronWeeklyUsersWithRecentCartEmailsJob = inngestClient.createFunction(
  { id: currentCron.id },
  { cron: `${website.cron} ${currentCron.cron}` },
  async ({ step }) => {
    const WeeksAgo = subWeeks(new Date(), 1);

    const usersWithRecentCart: UserProps[] = await step.run(
      `${currentCron.id}`,
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
