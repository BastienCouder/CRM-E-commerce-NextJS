"use client";

import SaleChart from "./charts/SaleChart";
import TopProductChart from "./charts/TopProductsChart";

interface AnalyticsProps {
  analyticsProductsData: any;
  analyticsOrdersData: any;
}

export default function Analytics({
  analyticsProductsData,
  analyticsOrdersData,
}: AnalyticsProps) {
  return (
    <>
      <section className="flex flex-col space-y-4 w-full">
        <div className="border-2 border-muted p-4 rounded-lg w-[35rem]">
          <SaleChart analyticsData={analyticsOrdersData} />
        </div>

        <div className="border-2 border-muted p-4 rounded-lg w-[25rem]">
          <TopProductChart analyticsData={analyticsProductsData} />
        </div>
      </section>
    </>
  );
}
