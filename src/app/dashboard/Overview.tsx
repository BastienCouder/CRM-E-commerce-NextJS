"use client";
import StatCard from "./components/StatCard";
import OrdersLengthSalesChart from "./components/charts/OrdersLengthSalesChart";

interface OverviewProps {
  analyticsProductsData: any;
  analyticsOrdersData: any;
  analyticsUsersData: any;
  analyticsWishlistCartOrderData: any;
}

export default function Overview({
  analyticsProductsData,
  analyticsUsersData,
  analyticsOrdersData,
  analyticsWishlistCartOrderData,
}: OverviewProps) {
  return (
    <>
      <article className="space-y-4">
        <section className="flex w-full space-x-4">
          <StatCard
            title="Revenu Total"
            data={analyticsOrdersData}
            value={analyticsOrdersData.maxSubtotal}
            secondaryText={`${analyticsOrdersData.subtotalDifferencePercent}`}
            type="price"
            variant="bars"
          />{" "}
          <StatCard
            title="Utilisateurs Total"
            data={analyticsUsersData}
            value={analyticsUsersData.totalUsers}
            secondaryText={`${analyticsUsersData.monthlyGrowthPercentage}`}
            type="nbr"
            variant="bars"
          />
        </section>
        <div className="p-4 rounded-lg bg-card">
          <OrdersLengthSalesChart analyticsData={analyticsOrdersData} />
        </div>
      </article>
    </>
  );
}
