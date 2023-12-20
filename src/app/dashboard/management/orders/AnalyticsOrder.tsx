"use client";
import React, { useState, useEffect } from "react";
import { CalendarDateRangePicker } from "@/components/dashboard/DateRangePicker";
import OrdersLengthChart from "@/components/charts/OrdersLengthChart";
import StatsCard from "@/components/dashboard/StatsCard";

interface AnalyticsOrderProps {
  analyticsData: any;
}

export default function AnalyticsOrder({ analyticsData }: AnalyticsOrderProps) {
  const [filteredData, setFilteredData] = useState(analyticsData);

  useEffect(() => {
    setFilteredData(analyticsData);
  }, [analyticsData]);

  const handleFilterChange = (range: { from: Date; to: Date }): void => {
    const { from, to } = range;
    const filtered = analyticsData.data.filter((data: any) => {
      const dataDate = new Date(data.date);
      return dataDate >= from && dataDate <= to;
    });

    setFilteredData({ ...analyticsData, data: filtered });
  };

  return (
    <div className="w-full flex space-x-4">
      <div className="w-full bg-card p-4 mb-6 rounded-lg pb-10 h-[18rem]">
        <OrdersLengthChart analyticsData={filteredData} />
      </div>
      <div className="space-y-4">
        <div className="flex flex-col gap-y-2">
          <h2>Voir sur une durée de :</h2>
          <CalendarDateRangePicker
            setDateRange={(range: { from: Date; to: Date }) =>
              handleFilterChange(range)
            }
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <h2>Ce mois ci :</h2>
          <div className="flex gap-x-4">
            <StatsCard
              title="Revenu Total"
              data={analyticsData}
              value={analyticsData.currentMonthSubtotal}
              secondaryText={`${analyticsData.subtotalDifferencePercent}`}
              type="price"
              variant="bars"
            />

            <StatsCard
              title="Nombre de Commandes"
              data={analyticsData}
              value={analyticsData.currentMonthOrderCount}
              secondaryText={`${analyticsData.orderCountDifferencePercent}% par rapport au mois dernier`}
              type="nbr"
              variant="area"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
