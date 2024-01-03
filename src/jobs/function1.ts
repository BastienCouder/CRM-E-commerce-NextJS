import { UserProps } from "@/lib/db/user";
import { sendEmail } from "@/lib/email/auth";
import { inngestClient } from "@/lib/inngestClient";
import { prisma } from "@/lib/prisma";
import { subWeeks } from "date-fns";

const cronWeeklyUsersWithRecentCartEmailsJob = inngestClient.createFunction(
  { id: "Weekly Emails" },
  { cron: "TZ=Europe/Paris 0 0 * * 6,0" },
  async ({ step }) => {
    const twoWeeksAgo = subWeeks(new Date(), 2);

    const usersWithRecentCart: UserProps = await step.run(
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
                      gt: twoWeeksAgo,
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })
    );

    for (const user of usersWithRecentCart) {
      await sendEmail(user.email!);
    }

    return { count: usersWithRecentCart.length };
  }
);

export default cronWeeklyUsersWithRecentCartEmailsJob;
