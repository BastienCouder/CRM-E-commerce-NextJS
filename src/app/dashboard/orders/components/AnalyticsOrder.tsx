"use client";

import React, { useState, useEffect } from "react";
import SaleChart from "./SaleChart";
import DateFilter from "../../components/DateFilter";
import { env } from "@/lib/env";

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
    const filtered = analyticsData.Data.filter((data: any) => {
      const dataDate = new Date(data.date);
      return dataDate >= startDate && dataDate <= endDate;
    });

    const maxTotal = filtered.reduce(
      (max: number, item: any) => Math.max(max, item.subtotal),
      0
    );

    setFilteredData({ Data: filtered, maxTotal });
  };

  return (
    <div className="flex space-x-4">
      <div className="w-1/2 border p-4 mb-6 rounded-lg">
        <h2 className="mb-2">Total des ventes</h2>
        <SaleChart analyticsData={filteredData} />
      </div>
      <div>
        <DateFilter
          onFilterChange={handleFilterChange}
          siteCreationDate={siteCreationDate}
        />
      </div>
    </div>
  );
}
