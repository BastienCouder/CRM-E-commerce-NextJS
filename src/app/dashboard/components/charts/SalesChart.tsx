"use client";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import formatPrice, { formatDateMonth } from "@/lib/format";

interface SalesChartProps {
  analyticsData: any;
}

interface CustomTooltipProps {
  active?: any;
  payload: any;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 text-[#000] text-sm bg-white rounded-lg">
        <p className="font-bold">
          {formatDateMonth(payload[0].payload.date, "long")}
        </p>

        {payload[0].payload.subtotal ? (
          <p>Total {formatPrice(payload[0].payload.subtotal, "EUR")}</p>
        ) : (
          <p>Aucune ventes</p>
        )}
      </div>
    );
  }

  return null;
};

export default function SalesChart({ analyticsData }: SalesChartProps) {
  const { data, maxSubtotal } = analyticsData;

  const yTickFormatter = (value: number) => {
    return formatPrice(value, "EUR");
  };

  return (
    <>
      <h2 className="mb-2">Total des revenus</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatDateMonth(value, "short")}
            style={{
              fontSize: "0.8rem",
              fill: "#f5f5f5",
            }}
            tickLine={false}
            axisLine={true}
          />
          <YAxis
            scale="linear"
            tickLine={false}
            style={{
              fontSize: "0.8rem",
              fill: "#f5f5f5",
            }}
            tickFormatter={yTickFormatter}
            axisLine={true}
          />

          <Tooltip
            cursor={{ fill: "#202020" }}
            formatter={formatPrice}
            content={<CustomTooltip payload={data} />}
          />

          <Bar dataKey="subtotal" fill="#f5f5f5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
