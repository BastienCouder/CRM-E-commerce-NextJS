import { Metadata } from "next";
import {
  useServerReadAnalyticsProducts,
  useServerReadAnalyticsWishlistCartOrder,
} from "./management/products/action";
import { useServerReadAnalyticsOrders } from "./management/orders/actions";
import { useServerReadAnalyticsUsers } from "./management/users/action";
import Overview from "./Overview";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  return (
    <>
      <div className="flex-1 space-y-4">
        <Overview
          analyticsProductsData={await useServerReadAnalyticsProducts()}
          analyticsOrdersData={await useServerReadAnalyticsOrders()}
          analyticsUsersData={await useServerReadAnalyticsUsers()}
          analyticsWishlistCartOrderData={await useServerReadAnalyticsWishlistCartOrder()}
        />
      </div>
    </>
  );
}
