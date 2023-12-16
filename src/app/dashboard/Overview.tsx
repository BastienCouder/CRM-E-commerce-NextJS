"use client";
import StatsCard from "./components/StatsCard";
import OrdersLengthSalesChart from "./components/charts/OrdersSalesLengthChart";

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
          <StatsCard
            title="Revenu total"
            data={analyticsOrdersData}
            value={analyticsOrdersData.maxSubtotal}
            secondaryText={`${analyticsOrdersData.subtotalDifferencePercent}`}
            type="price"
            variant="bars"
          />
          <StatsCard
            title="Utilisateurs total"
            data={analyticsUsersData}
            value={analyticsUsersData.totalUsers}
            secondaryText={`${analyticsUsersData.monthlyGrowthPercentage}`}
            type="nbr"
            variant="line"
          />
          <StatsCard
            title="Produit vendus au total"
            data={analyticsProductsData}
            value={analyticsProductsData.totalProductsSales}
            secondaryText={`${analyticsProductsData.salesGrowthPercentage}`}
            type="nbr"
            variant="area"
          />
        </section>
        <div className="w-[50rem] p-4 rounded-lg bg-card">
          <OrdersLengthSalesChart analyticsData={analyticsOrdersData} />
        </div>
      </article>
    </>
  );
}
