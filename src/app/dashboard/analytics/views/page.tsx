import { Metadata } from "next";
import { useServerReadAnalyticsOrders } from "../../management/orders/actions";
import {
  useServerReadAnalyticsProducts,
  useServerReadAnalyticsWishlistCartOrder,
} from "../../management/products/action";
import OverviewNav from "@/components/dashboard/AnalyticsNav";
import { useServerReadAnalyticsUsers } from "../../management/users/action";
import { calculateStatistics } from "./action";
import DeviceChart from "@/components/charts/BrowserChart";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function ViewsPage() {
  return (
    <>
      <div className="flex-1 space-y-4">
        <OverviewNav
          analyticsProductsData={await useServerReadAnalyticsProducts()}
          analyticsOrdersData={await useServerReadAnalyticsOrders()}
          analyticsUsersData={await useServerReadAnalyticsUsers()}
          analyticsWishlistCartOrderData={await useServerReadAnalyticsWishlistCartOrder()}
        />
        <DeviceChart analyticsData={await calculateStatistics()} />
      </div>
    </>
  );
}
