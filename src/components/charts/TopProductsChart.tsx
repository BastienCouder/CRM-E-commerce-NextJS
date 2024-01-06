"use client";
import formatPrice from "../../../format";
import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface TopProductChartsProps {
  analyticsData: any;
}

const COLORS = ["#f7f7f7", "#e2e2e2", "#a8a8a8", "#646464", "#2b2b2b"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 text-[#000] text-sm bg-white rounded-lg">
        <p className="font-bold">{data.name}</p>
        <p>{`Revenus total: ${formatPrice(data.totalSales, "EUR")}`}</p>
      </div>
    );
  }

  return null;
};

export default function TopProductsChart({
  analyticsData,
}: TopProductChartsProps) {
  return (
    <>
      <h2>
        Top {analyticsData?.topProducts?.length} des produits les plus vendus
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={analyticsData.topProducts}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="totalSales"
            label={(entry) => entry.name}
          >
            {analyticsData?.topProducts?.map((entry: string, index: number) => (
              <Cell
                key={`cell-${entry}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
