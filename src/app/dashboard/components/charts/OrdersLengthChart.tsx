"use client";
import { formatDateMonth } from "@/lib/format";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface OrdersLengthChartProps {
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

        {payload[0].payload.orderItems ? (
          <p>Total : {payload[0].payload.orderItems}</p>
        ) : (
          <p>Aucune ventes</p>
        )}
      </div>
    );
  }

  return null;
};

export default function OrdersLengthChart({
  analyticsData,
}: OrdersLengthChartProps) {
  const { data, maxOrderItems } = analyticsData;

  return (
    <>
      <h2 className="mb-2">Nombres de commandes</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatDateMonth(value, "short")}
            style={{
              fontSize: "0.8rem",
              fontFamily: "Arial",
            }}
            tickLine={false}
            axisLine={true}
          />
          <YAxis
            domain={[0, maxOrderItems + maxOrderItems / 4]}
            scale="linear"
            tickLine={false}
            style={{
              fontSize: "0.8rem",
              fontFamily: "Arial",
            }}
            axisLine={true}
          />

          <Tooltip
            cursor={{ fill: "#202020" }}
            content={<CustomTooltip payload={data} />}
          />

          <Bar dataKey="orderItems" fill="#f5f5f5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}