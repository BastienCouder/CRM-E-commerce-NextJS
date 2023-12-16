import { Metadata } from "next";
import { useServerReadAnalyticsOrders } from "./orders/actions";
import {
  useServerReadAnalyticsProducts,
  useServerReadAnalyticsWishlistCartOrder,
} from "./products/action";
import OverviewNav from "./OverviewNav";
import { useServerReadAnalyticsUsers } from "./users/action";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  const analyticsProductsData = await useServerReadAnalyticsProducts();
  const analyticsOrdersData = await useServerReadAnalyticsOrders();
  const analyticsUsersData = await useServerReadAnalyticsUsers();
  const analyticsWishlistCartOrderData =
    await useServerReadAnalyticsWishlistCartOrder();

  return (
    <>
      <div className="flex-1 space-y-4">
        <OverviewNav
          analyticsProductsData={analyticsProductsData}
          analyticsOrdersData={analyticsOrdersData}
          analyticsUsersData={analyticsUsersData}
          analyticsWishlistCartOrderData={analyticsWishlistCartOrderData}
        />
      </div>
    </>
  );
}
