import website from "@/lib/data/infosWebsite";
import { inngestClient } from "@/lib/inngestClient";
import { prisma } from "@/lib/prisma";

const cronClearDBJob = inngestClient.createFunction(
  { id: "clear db" },
  { cron: `${website.cron} 30 10 * * 1` },
  async (event) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    try {
      const deletedStripeSessions = await prisma.stripeSession.deleteMany({
        where: {
          isProcessed: true,
          updatedAt: {
            lt: yesterday,
          },
        },
      });

      return { deletedSessionsCount: deletedStripeSessions.count };
    } catch (error: any) {
      throw new Error(`Error clearing Stripe sessions:", ${error.message}`);
    }
  }
);

export default cronClearDBJob;
