"use client";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import CustomTooltip from "../../components/CustomTooltip";
import formatPrice, { formatDateMonth } from "@/lib/format";

interface SaleChartProps {
  analyticsData: any;
}

export default function SaleChart({ analyticsData }: SaleChartProps) {
  const { Data, maxTotal } = analyticsData;

  const yTickFormatter = (value: number) => {
    return formatPrice(value, "EUR");
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={Data}>
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
          domain={[0, maxTotal + maxTotal / 4]}
          scale="linear"
          tickLine={false}
          style={{
            fontSize: "0.8rem",
            fontFamily: "Arial",
          }}
          tickFormatter={yTickFormatter}
          axisLine={true}
        />

        <Tooltip
          formatter={formatPrice}
          content={<CustomTooltip payload={Data} />}
        />

        <Bar dataKey="subtotal" fill="#f5f5f5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
