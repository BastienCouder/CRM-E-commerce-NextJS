import { Metadata } from "next";
import { getUsersWithNoRecentOrderItems } from "../action/users-with-no-recent-orders";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function NewsletterPage() {
  const log = await getUsersWithNoRecentOrderItems();

  console.log(log);

  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="p-4 rounded-lg bg-card">
          {/* <NewsletterLengthChart
            analyticsData={await useServerReadAnalyticsUsers()}
          /> */}
        </div>
      </div>
    </>
  );
}
