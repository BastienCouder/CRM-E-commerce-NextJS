"use client";

import { useEffect, useState } from "react";
import SalesChart from "./components/charts/SalesChart";
import TopProductChart from "./components/charts/TopProductsChart";
import DateFilter from "./components/DateFilter";
import WhislistCartOrderLength from "./components/charts/WishlistCartOrderLength";

interface AnalyticsProps {
  analyticsProductsData: any;
  analyticsOrdersData: any;
  analyticsWishlistCartOrderData: any;
}

export default function Analytics({
  analyticsProductsData,
  analyticsOrdersData,
  analyticsWishlistCartOrderData,
}: AnalyticsProps) {
  const [filteredOrdersData, setFilteredOrdersData] =
    useState(analyticsOrdersData);

  useEffect(() => {
    setFilteredOrdersData(analyticsOrdersData);
  }, [analyticsOrdersData, analyticsProductsData]);

  const handleFilterChange = (
    startDate: Date,
    endDate: Date = new Date()
  ): void => {
    const filteredOrders: any = analyticsOrdersData.data.filter((data: any) => {
      const dataDate = new Date(data.date);
      return dataDate >= startDate && dataDate <= endDate;
    });

    setFilteredOrdersData({ ...analyticsOrdersData, data: filteredOrders });
  };

  return (
    <>
      <section className="space-y-4">
        <DateFilter
          onFilterChange={handleFilterChange}
          siteCreationDate={new Date("2022-07-12")}
          type="analytics"
        />
        <article className="flex flex-col space-y-4 w-full">
          <div className="flex space-x-4">
            <div className="bg-muted p-5 rounded-lg pb-12 w-[48rem] h-[20rem]">
              <SalesChart analyticsData={filteredOrdersData} />
            </div>
            <div className="bg-muted p-4 rounded-lg  w-[25rem] h-[20rem]">
              <TopProductChart analyticsData={analyticsProductsData} />
            </div>
          </div>
          <div className="bg-muted  p-4 rounded-lg w-[40rem]  h-[25rem]">
            <WhislistCartOrderLength
              analyticsData={analyticsWishlistCartOrderData}
            />
          </div>
        </article>
      </section>
    </>
  );
}
