import { Metadata } from "next";
import Overview from "./Overview";
import { useServerReadAnalyticsOrders } from "./orders/actions";
import { useServerReadAnalyticsProducts } from "./products/action";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  const analyticsProductsData = await useServerReadAnalyticsProducts();
  const analyticsOrdersData = await useServerReadAnalyticsOrders();

  return (
    <>
      <div className="flex-1 space-y-4">
        <Overview
          analyticsProductsData={analyticsProductsData}
          analyticsOrdersData={analyticsOrdersData}
        />
      </div>
    </>
  );
}
