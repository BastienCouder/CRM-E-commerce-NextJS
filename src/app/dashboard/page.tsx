import { Metadata } from "next";
import { getOrderItems } from "@/lib/db/orderItem";
import StatsCard from "@/components/dashboard/stats-card";
import SalesChart from "@/components/charts/sales-chart";
import DeviceChart from "@/components/charts/device-chart";

import { readAnalyticsProducts } from "./analytics/actions/analytics-products";
import { readAnalyticsOrders } from "./analytics/actions/analytics-orders";
import { readAnalyticsWishlistCartOrder } from "./analytics/actions/analytics-interactions-products";
import {
  readAnalyticsVisited,
  readAnalyticsVisitorInfos,
} from "./analytics/actions/analytics-visitors";
import { readAnalyticsNewsletter } from "./analytics/actions/analytics-newsletter";
import LatestPurchasedProducts from "@/components/dashboard/last-purshased-products";
import { getLatestPurchasedProducts } from "./actions/last-purchased-product";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function Dashboard() {
  const analyticsProductsData = await readAnalyticsProducts();
  // const analyticsOrdersData = await readAnalyticsOrders();
  const analyticsUsersData = await readAnalyticsNewsletter();
  const analyticsVisitorInfosData = await readAnalyticsVisitorInfos();
  // const latestProducts = await getLatestPurchasedProducts();

  if (
    analyticsProductsData ||
    // analyticsOrdersData ||
    analyticsUsersData ||
    analyticsVisitorInfosData
  )
    return (
      <>
        <div className="flex-1 space-y-4">
          <section className="flex w-full space-x-4">
            {/* <StatsCard
            title="Revenu total"
            data={analyticsOrdersData}
            value={analyticsOrdersData.maxSubtotal}
            secondaryText={`${analyticsOrdersData.subtotalDifferencePercent}`}
            type="price"
            variant="dollars"
          /> */}
            <StatsCard
              title="Utilisateurs total"
              data={analyticsUsersData}
              value={analyticsUsersData.totalUsers}
              secondaryText={`${analyticsUsersData.monthlyGrowthPercentage}`}
              type="nbr"
              variant="trening"
            />
            <StatsCard
              title="Produit vendus au total"
              data={analyticsProductsData}
              value={analyticsProductsData.totalProductsSales}
              secondaryText={`${analyticsProductsData.salesGrowthPercentage}`}
              type="nbr"
              variant="zap"
            />
            {/* <StatsCard
            title="Profit total"
            data={analyticsOrdersData}
            value={analyticsOrdersData.maxSubtotal}
            secondaryText={`${analyticsOrdersData.subtotalDifferencePercent}`}
            type="price"
            variant="trening"
          /> */}
          </section>
          <section className="flex flex-col gap-y-4">
            <div className="flex gap-x-4">
              <SalesChart />
              {/* <ViewsChart analyticsData={analyticsVisitedData} /> */}
            </div>
            <div className="flex gap-x-4">
              {/* <LatestPurchasedProducts latestProducts={latestProducts} /> */}
              <DeviceChart analyticsData={analyticsVisitorInfosData} />
            </div>
          </section>
        </div>
      </>
    );
}
