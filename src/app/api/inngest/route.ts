import { serve } from "inngest/next";
import { inngestClient } from "@/lib/inngestClient";
import cronWeeklyUsersWithNoRecentOrdersEmailsJob from "@/jobs/cron-weekly-user-with-recent-cart";

export const { GET, POST, PUT } = serve({
  client: inngestClient,
  functions: [cronWeeklyUsersWithNoRecentOrdersEmailsJob],
  streaming: "allow",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
