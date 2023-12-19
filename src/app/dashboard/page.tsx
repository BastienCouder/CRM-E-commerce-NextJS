import { Metadata } from "next";
import OverviewNav from "../../components/dashboard/OverviewNav";
import {
  useServerReadAnalyticsProducts,
  useServerReadAnalyticsWishlistCartOrder,
} from "./management/products/action";
import { useServerReadAnalyticsOrders } from "./management/orders/actions";
import { useServerReadAnalyticsUsers } from "./management/users/action";

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
