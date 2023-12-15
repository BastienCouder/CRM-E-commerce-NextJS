"use client";
import NewsletterLengthChart from "./components/charts/NewsletterLengthChart";

interface NewsletterProps {
  analyticsUsersData: any;
}

export default function Newsletter({ analyticsUsersData }: NewsletterProps) {
  return (
    <>
      <article className="space-y-4">
        <div className="p-4 rounded-lg bg-card">
          <NewsletterLengthChart analyticsData={analyticsUsersData} />
        </div>
      </article>
    </>
  );
}
