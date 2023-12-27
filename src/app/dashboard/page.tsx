import { Metadata } from "next";
import Overview from "./Overview";
import {
  readAnalyticsProducts,
  readAnalyticsWishlistCartOrder,
} from "./management/products/action";
import { readAnalyticsUsers } from "./management/users/action";
import { readAnalyticsOrders } from "./management/orders/actions";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function Dashboard() {
  return (
    <>
      <div className="flex-1 space-y-4">
        <Overview
          analyticsProductsData={await readAnalyticsProducts()}
          analyticsOrdersData={await readAnalyticsOrders()}
          analyticsUsersData={await readAnalyticsUsers()}
          analyticsWishlistCartOrderData={await readAnalyticsWishlistCartOrder()}
        />
      </div>
    </>
  );
}
