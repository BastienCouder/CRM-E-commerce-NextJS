import { Metadata } from "next";
import AnalyticsNav from "@/components/dashboard/analytics-nav";
import { readAnalyticsOrders } from "./actions/analytics-orders";
import { readAnalyticsProducts } from "./actions/analytics-products"; // Import manquant
import { readAnalyticsWishlistCartOrder } from "./actions/analytics-interactions-products"; // Import manquant

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function ViewsPage() {
  return (
    <>
      {/* <div className="flex-1 space-y-4">
        <AnalyticsNav
          analyticsProductsData={readAnalyticsProducts}
          analyticsOrdersData={readAnalyticsOrders}
          analyticsWishlistCartOrderData={readAnalyticsWishlistCartOrder}
        />
      </div> */}
    </>
  );
}
