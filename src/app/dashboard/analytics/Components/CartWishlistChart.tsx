"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CartWishlistChartProps {
  analyticsData: any;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = { month: "short" };

  return new Intl.DateTimeFormat("fr-FR", options).format(date);
};

export default function CartWishlistChart({
  analyticsData,
}: CartWishlistChartProps) {
  const { groupedData, maxTotal } = analyticsData;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        width={500}
        height={400}
        data={groupedData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, maxTotal + 2]}
          scale="linear"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Area
          type="monotone"
          dataKey="cartItems"
          stackId="1"
          stroke="#f1c232"
          fill="#f1c232"
        />
        <Area
          type="monotone"
          dataKey="wishlistItems"
          stackId="2"
          stroke="#16537e"
          fill="#16537e"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
