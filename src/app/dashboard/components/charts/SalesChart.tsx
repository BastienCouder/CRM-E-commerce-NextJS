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

interface SalesChartProps {
  analyticsData: any;
}

interface CustomLegendProps {
  payload: Array<{
    value: string;
    type: string;
    id: string;
  }>;
}

const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
  return (
    <ul
      className="flex gap-x-4 w-full justify-center"
      style={{ listStyleType: "none", padding: 0, margin: 0 }}
    >
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
        >
          <BarChart2 size={15} />
          <span style={{ fontSize: "0.8rem", marginLeft: 5 }}>
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

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
  const { data } = analyticsData;

  const yTickFormatter = (value: number) => {
    return formatPrice(value, "EUR");
  };

  return (
    <>
      <h2 className="mb-2">Total des revenus</h2>
      <Separator className="bg-white/50" />

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} className="mt-2">
          <Legend
            verticalAlign="top"
            content={<CustomLegend payload={data} />}
          />
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

          <Bar
            dataKey="subtotal"
            fill="#f5f5f5"
            radius={[4, 4, 0, 0]}
            name="Total des ventes"
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
