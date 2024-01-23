import { Metadata } from "next";
import AnalyticsNav from "@/components/dashboard/analytics-nav";
import { readAnalyticsProducts } from "./actions/analytics-products";
import { readAnalyticsOrders } from "./actions/analytics-orders";
import { readAnalyticsWishlistCartOrder } from "./actions/analytics-interactions-products";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function ViewsPage() {
  return (
    <>
      <div className="flex-1 space-y-4">
        <AnalyticsNav
          analyticsProductsData={await readAnalyticsProducts()}
          analyticsOrdersData={await readAnalyticsOrders()}
          analyticsWishlistCartOrderData={await readAnalyticsWishlistCartOrder()}
        />
      </div>
    </>
  );
}
