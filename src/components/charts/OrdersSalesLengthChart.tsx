"use client";

import { Separator } from "@/components/ui/separator";
import { formatDateMonth } from "@/helpers/format";
import { LineChart, AreaChart } from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  ComposedChart,
  Legend,
  Area,
  Line,
} from "recharts";

interface OrdersSalesLengthChartProps {
  analyticsData: any;
}

interface CustomLegendProps {
  payload: Array<{
    value: string;
    type: string;
    id: string;
  }>;
}

const axisStyle = {
  fontSize: "0.8rem",
  fill: "rgb(var(--foreground))",
};

const CustomLegend = ({ payload }: CustomLegendProps) => {
  return (
    <ul className="flex gap-x-4 w-full justify-center list-none p-0 m-0">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center mb-1">
          {entry.value === "Nombres de ventes" ? (
            <LineChart size={15} color="rgb(var(--chart))" />
          ) : (
            <AreaChart size={15} color="rgb(var(--chart))" />
          )}
          <span className={`ml-1 text-sm text-chart`}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

export default function OrdersSalesLengthChart({
  analyticsData,
}: OrdersSalesLengthChartProps) {
  const { data } = analyticsData;

  return (
    <>
      <h2 className="mb-2">Analyses des ventes</h2>
      <Separator className="bg-[rgba(var(--foreground),0.5)]" />

      <ResponsiveContainer width={750} height={320}>
        <ComposedChart data={data} className="mt-2">
          <Legend
            verticalAlign="top"
            content={<CustomLegend payload={data} />}
          />
          <XAxis
            dataKey="date"
            scale="band"
            tickLine={false}
            axisLine={{ stroke: "rgb(var(--foreground))" }}
            style={axisStyle}
            tickFormatter={(value) => formatDateMonth(value, "short")}
          />
          <YAxis
            scale="linear"
            tickLine={false}
            axisLine={{ stroke: "rgb(var(--foreground))" }}
            style={axisStyle}
          />
          <Area
            type="monotone"
            name="Nombres de ventes"
            dataKey="totalOrders"
            fill="rgb(var(--chart))"
            stroke="none"
          />
          <Line
            type="monotone"
            name="Nombres de commandes"
            dataKey="totalNocanceledOrders"
            stroke="rgb(var(--chart))"
            strokeWidth={3}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
}
