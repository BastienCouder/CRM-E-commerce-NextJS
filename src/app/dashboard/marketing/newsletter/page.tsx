import { Metadata } from "next";
import NewsletterLengthChart from "@/components/charts/NewsletterLengthChart";
import { useServerReadAnalyticsUsers } from "../../management/users/action";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function NewsletterPage() {
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