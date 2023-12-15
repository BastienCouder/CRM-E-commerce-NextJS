"use client";
import { Separator } from "@/components/ui/separator";
import { formatDateMonth } from "@/lib/format";
import { AreaChart } from "lucide-react";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  ComposedChart,
  Legend,
  Area,
} from "recharts";

interface NewsletterLengthChartProps {
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
          <AreaChart size={15} />
          <span style={{ fontSize: "0.8rem", marginLeft: 5 }}>
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default function NewsletterLengthChart({
  analyticsData,
}: NewsletterLengthChartProps) {
  const { data, totalUsers } = analyticsData;

  return (
    <>
      <h2 className="mb-2">
        {totalUsers > 1 ? "Nombre d'abonnés" : "Nombre d'abonné"}
      </h2>
      <Separator className="bg-white/50" />

      <ResponsiveContainer width={750} height={320}>
        <ComposedChart data={data} className="mt-2">
          <Legend
            verticalAlign="top"
            content={<CustomLegend payload={data} />}
          />

          <XAxis
            style={{
              fontSize: "0.8rem",
              fill: "#f5f5f5",
            }}
            dataKey="date"
            scale="band"
            tickLine={false}
            axisLine={true}
            tickFormatter={(value) => formatDateMonth(value, "short")}
          />
          <YAxis
            style={{
              fontSize: "0.8rem",
              fill: "#f5f5f5",
            }}
            scale="linear"
            tickLine={false}
            axisLine={true}
          />
          <Area
            type="monotone"
            name="Nombres de nouveau abonnées"
            dataKey="newsletterSubscribersCount"
            fill="#fff"
            stroke="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
}
