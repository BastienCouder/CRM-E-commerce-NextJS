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
  const { Data, maxSubtotal } = analyticsData;

  const yTickFormatter = (value: number) => {
    return formatPrice(value, "EUR");
  };

  return (
    <>
      <h2 className="mb-2">Total des ventes</h2>
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
            domain={[0, maxSubtotal + maxSubtotal / 4]}
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
            cursor={{ fill: "#202020" }}
            formatter={formatPrice}
            content={<CustomTooltip payload={Data} type="price" />}
          />

          <Bar dataKey="subtotal" fill="#f5f5f5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
