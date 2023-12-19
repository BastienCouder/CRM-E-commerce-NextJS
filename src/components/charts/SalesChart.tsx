"use client";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import formatPrice, { formatDateMonth } from "@/lib/format";
import { BarChart2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AnalyticsOrdersData } from "../../orders/actions";

interface SalesChartProps {
  analyticsData: any;
}

const CustomLegend: React.FC<{ payload: Array<{ value: string }> }> = ({
  payload,
}) => (
  <ul className="flex gap-x-4 w-full justify-center list-none p-0 m-0">
    {payload.map((entry, index) => (
      <li key={index} className="flex items-center mb-1">
        <BarChart2 size={15} color="rgb(var(--chart1))" />
        <span className="ml-1 text-sm text-chart1">{entry.value}</span>
      </li>
    ))}
  </ul>
);

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: AnalyticsOrdersData }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;
  const { date, subtotal } = payload[0].payload;

  return (
    <div className="p-3 text-background text-sm bg-foreground rounded-lg">
      <p className="font-bold">{formatDateMonth(date, "long")}</p>
      <p>
        {subtotal ? `Total ${formatPrice(subtotal, "EUR")}` : "Aucune ventes"}
      </p>
    </div>
  );
};

const axisStyle = { fontSize: "0.8rem", fill: "#f5f5f5" };

export default function SalesChart({ analyticsData }: SalesChartProps) {
  const { data } = analyticsData;

  return (
    <>
      <h2 className="mb-2">Total des revenus</h2>
      <Separator className="bg-[rgba(var(--foreground),0.5)]" />
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} className="mt-2">
          <Legend
            verticalAlign="top"
            content={<CustomLegend payload={data} />}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatDateMonth(value, "short")}
            style={axisStyle}
            tickLine={false}
            axisLine={{ stroke: "rgb(var(--foreground))" }}
          />
          <YAxis
            scale="linear"
            tickLine={false}
            style={axisStyle}
            tickFormatter={(value) => formatPrice(value, "EUR")}
            axisLine={{ stroke: "rgb(var(--foreground))" }}
          />
          <Tooltip
            cursor={{ fill: "rgb(var(--muted))" }}
            formatter={formatPrice}
            content={<CustomTooltip />}
          />
          <Bar
            dataKey="subtotal"
            fill="rgb(var(--chart1))"
            radius={[4, 4, 0, 0]}
            name="Total des ventes"
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
