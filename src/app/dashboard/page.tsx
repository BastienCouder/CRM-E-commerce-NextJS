import { Metadata } from "next";
import { useServerReadAnalyticsOrders } from "./orders/actions";
import {
  useServerReadAnalyticsProducts,
  useServerReadAnalyticsWishlistCartOrder,
} from "./products/action";
import OverviewNav from "./components/OverviewNav";
import { useServerReadAnalyticsUsers } from "./users/action";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  return (
    <>
      <div className="flex-1 space-y-4">
        <OverviewNav
          analyticsProductsData={await useServerReadAnalyticsProducts()}
          analyticsOrdersData={await useServerReadAnalyticsOrders()}
          analyticsUsersData={await useServerReadAnalyticsUsers()}
          analyticsWishlistCartOrderData={await useServerReadAnalyticsWishlistCartOrder()}
        />
      </div>
    </>
  );
}
