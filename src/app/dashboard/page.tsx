import { Metadata } from "next";
import {
  readAnalyticsProducts,
  readAnalyticsWishlistCartOrder,
} from "./management/products/action";
import { readAnalyticsUsers } from "./management/users/action";
import { readAnalyticsOrders } from "./management/orders/actions";
import { getOrderItems } from "@/lib/db/orderItem";
import StatsCard from "@/components/dashboard/StatsCard";
import SalesChart from "@/components/charts/SalesChart";
import Image from "next/image";
import GeoChart from "@/components/charts/GeoChart";
import DeviceChart from "@/components/charts/DeviceChart";
import {
  readAnalyticsVisited,
  readAnalyticsVisitorInfos,
} from "./analytics/action";
import ViewsChart from "@/components/charts/ViewsChart";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function Dashboard() {
  const orders = await getOrderItems();
  const analyticsProductsData = await readAnalyticsProducts();
  const analyticsOrdersData = await readAnalyticsOrders();
  const analyticsUsersData = await readAnalyticsUsers();
  const analyticsWishlistCartOrderData = await readAnalyticsWishlistCartOrder();
  const analyticsVisitorInfosData = await readAnalyticsVisitorInfos();
  const analyticsVisitedData = await readAnalyticsVisited();

  return (
    <>
      <div className="flex-1 space-y-4">
        <section className="flex w-full space-x-4">
          <StatsCard
            title="Revenu total"
            data={analyticsOrdersData}
            value={analyticsOrdersData.maxSubtotal}
            secondaryText={`${analyticsOrdersData.subtotalDifferencePercent}`}
            type="price"
            variant="dollars"
          />
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
        </section>
        <section className="flex flex-col gap-y-4">
          <div className="flex gap-x-4">
            <SalesChart />
            <ViewsChart analyticsData={analyticsVisitedData} />
          </div>
          <div className="flex gap-x-4">
            <GeoChart />
            <DeviceChart analyticsData={analyticsVisitorInfosData} />
          </div>
        </section>
        {/* {orders?.slice(0, 5).map((orderItem, index) => (
          <LastOrderItem key={index} orderItem={orderItem} />
        ))} */}
      </div>
    </>
  );
}
