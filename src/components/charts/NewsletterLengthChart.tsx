import { Separator } from "@/components/ui/separator";
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

const CustomLegend = ({ payload }: CustomLegendProps) => {
  return (
    <ul className="flex gap-x-4 w-full justify-center list-none p-0 m-0">
      {payload.map((entry, index) => (
        <li key={index} className="flex items-center mb-1">
          <AreaChart size={15} color="rgb(var(--chart))" />
          <span className="ml-1 text-sm text-chart">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const axisStyle = { fontSize: "0.8rem", fill: "rgb(var(--foreground))" };

export default function NewsletterLengthChart({
  analyticsData,
}: NewsletterLengthChartProps) {
  const { data, totalUsers } = analyticsData;

  return (
    <>
      <h2 className="mb-2">
        {totalUsers > 1 ? "Nombre d'abonnés" : "Nombre d'abonné"}
      </h2>
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
          />
          <YAxis
            scale="linear"
            tickLine={false}
            style={axisStyle}
            axisLine={{ stroke: "rgb(var(--foreground))" }}
          />
          <Area
            type="monotone"
            name="Nombres de nouveau abonnées"
            dataKey="newsletterSubscribersCount"
            fill="rgb(var(--chart))"
            stroke="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
}
