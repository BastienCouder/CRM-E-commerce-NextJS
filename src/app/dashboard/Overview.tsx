"use client";
import StatsCard from "@/components/dashboard/StatsCard";
import SalesChart from "@/components/charts/SalesChart";

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
            variant="dollars"
          />
          <StatsCard
            title="Utilisateurs total"
            data={analyticsUsersData}
            value={analyticsUsersData.totalUsers}
            secondaryText={`${analyticsUsersData.monthlyGrowthPercentage}`}
            type="nbr"
            variant="trening"
          />
          <StatsCard
            title="Produit vendus au total"
            data={analyticsProductsData}
            value={analyticsProductsData.totalProductsSales}
            secondaryText={`${analyticsProductsData.salesGrowthPercentage}`}
            type="nbr"
            variant="zap"
          />
        </section>
        <section className="flex flex-col gap-y-4">
          <SalesChart />
          {/* <div className="w-[50rem] h-[25rem] p-4 rounded-lg bg-card">
            <OrdersLengthSalesChart analyticsData={analyticsOrdersData} />
          </div>
          <BrowserChart analyticsData={calculateStatistics} /> */}
        </section>
      </article>
    </>
  );
}
