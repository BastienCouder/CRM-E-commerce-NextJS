"use client";
import formatPrice from "@/lib/format";
import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface AnalyticsData {
  name: string;
  totalSales: number;
}

interface TopProductChartProps {
  analyticsData: any;
}

const COLORS = ["#f7f7f7", "#e3e3e3", "#a8a8a8", "#646464", "#2b2b2b"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Accéder aux données de l'élément actif
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          color: "#000",
        }}
      >
        <p>{data.name}</p>
        <p>{`Revenus total: ${formatPrice(data.totalSales, "EUR")}`}</p>
      </div>
    );
  }

  return null;
};

export default function TopProductChart({
  analyticsData,
}: TopProductChartProps) {
  return (
    <>
      <h2>Top des produits</h2>
      <ResponsiveContainer width="100%" height={300}>
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
            {analyticsData.topProducts.map((entry: string, index: number) => (
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
