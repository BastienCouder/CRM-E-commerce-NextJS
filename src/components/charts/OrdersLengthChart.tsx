"use client";
import { formatDateMonth } from "@/helpers/format";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  AnalyticsOrdersData,
  useServerReadAnalyticsOrdersProps,
} from "@/app/dashboard/management/orders/actions";

interface OrdersLengthChartProps {
  analyticsData: useServerReadAnalyticsOrdersProps;
}

const axisStyle = {
  fontSize: "0.8rem",
  fill: "rgb(var(--foreground))",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: AnalyticsOrdersData }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const { date, totalNocanceledOrders } = payload[0].payload;

    return (
      <div className="p-3 text-background text-sm bg-foreground rounded-lg">
        <p className="font-bold">{formatDateMonth(date, "long")}</p>
        <p>
          {totalNocanceledOrders
            ? `Total : ${totalNocanceledOrders}`
            : "Aucune ventes"}
        </p>
      </div>
    );
  }

  return null;
};

export default function OrdersLengthChart({
  analyticsData,
}: OrdersLengthChartProps) {
  const { data } = analyticsData;

  return (
    <>
      <h2 className="mb-2">Nombres de commandes</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatDateMonth(value, "short")}
            style={axisStyle}
            tickLine={false}
            axisLine={{ stroke: "rgb(var(--foreground))" }}
          />
          <YAxis
            scale="linear"
            style={axisStyle}
            tickLine={false}
            axisLine={{ stroke: "rgb(var(--foreground))" }}
          />
          <Tooltip
            cursor={{ fill: "rgb(var(--muted))" }}
            content={<CustomTooltip />}
          />
          <Bar
            dataKey="totalNocanceledOrders"
            fill="rgb(var(--chart1))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
