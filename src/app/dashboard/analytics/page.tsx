import { Metadata } from "next";
import AnalyticsNav from "@/components/dashboard/AnalyticsNav";
import DeviceChart from "@/components/charts/DeviceChart";
import BrowserChart from "@/components/charts/BrowserChart";
import {
  readAnalyticsProducts,
  readAnalyticsWishlistCartOrder,
} from "../management/products/action";
import { readAnalyticsOrders } from "../management/orders/actions";
import { readAnalyticsUsers } from "../management/users/action";
import { readAnalyticsVisitorInfos } from "./action";

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
          analyticsUsersData={await readAnalyticsUsers()}
          analyticsWishlistCartOrderData={await readAnalyticsWishlistCartOrder()}
        />
        <BrowserChart analyticsData={await readAnalyticsVisitorInfos()} />
        <DeviceChart analyticsData={await readAnalyticsVisitorInfos()} />
      </div>
    </>
  );
}
