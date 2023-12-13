"use client";

import React, { useState, useEffect } from "react";

import DateFilter from "../components/DateFilter";

import StatCard from "../components/StatCard";
import OrdersLengthChart from "../components/charts/OrdersLengthChart";

interface AnalyticsOrderProps {
  analyticsData: any;
}

export default function AnalyticsOrder({ analyticsData }: AnalyticsOrderProps) {
  const [filteredData, setFilteredData] = useState(analyticsData);
  const siteCreationDate = new Date("2022-07-12");

  useEffect(() => {
    setFilteredData(analyticsData);
  }, [analyticsData]);

  const handleFilterChange = (startDate: Date): void => {
    const endDate = new Date();
    const filtered = analyticsData.data.filter((data: any) => {
      const dataDate = new Date(data.date);
      return dataDate >= startDate && dataDate <= endDate;
    });

    const maxTotal = filtered.reduce(
      (max: number, item: any) => Math.max(max, item.subtotal),
      0
    );

    setFilteredData({ data: filtered, maxTotal });
  };

  return (
    <div className="flex space-x-4">
      <div className="w-1/2 border p-4 mb-6 rounded-lg pb-10 h-[18rem]">
        <OrdersLengthChart analyticsData={filteredData} />
      </div>
      <div className="space-y-4">
        <div className="flex flex-col gap-y-2">
          <h2>Voir sur une durée de :</h2>
          <DateFilter
            onFilterChange={handleFilterChange}
            siteCreationDate={siteCreationDate}
            type="orders"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <h2>Ce mois ci :</h2>
          <div className="w-full flex gap-x-4">
            <StatCard
              title="Revenu Total"
              value={analyticsData.currentMonthSubtotal}
              secondaryText={`${analyticsData.subtotalDifferencePercent}`}
              type="price"
            />
            <StatCard
              title="Nombre de Commandes"
              value={analyticsData.currentMonthOrderCount}
              secondaryText={`${analyticsData.orderCountDifferencePercent}% par rapport au mois dernier`}
              type="nbr"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
