"use client";
import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AnalyticsVisitedData } from "@/app/dashboard/analytics/action";
import { Separator } from "../ui/separator";

interface ViewsChartProps {
  analyticsData: any;
}

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { payload: AnalyticsVisitedData }[];
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;
  const { totalVisits } = payload[0].payload;

  return (
    <div className="p-3 text-background text-sm bg-foreground rounded-lg">
      <p className="font-bold">{label}</p>
      <p>Total :{totalVisits}</p>
    </div>
  );
};

export default function ViewsChart({
  analyticsData: { data },
}: ViewsChartProps) {
  const chartData = useMemo(() => {
    return data.map((visite: any) => ({
      subject: visite.date,
      Visites: visite.totalVisits,
      fullMark: 100,
    }));
  }, [data]);

  return (
    <>
      <section className="w-2/5 p-4 h-[25rem] rounded-lg bg-card space-y-4">
        <div className="w-full flex justify-between mb-2">
          <div className="flex flex-col justify-between">
            <h2>Total de Visiteurs</h2>
          </div>
        </div>
        <Separator className="bg-[rgba(var(--foreground),0.5)]" />
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            className="pb-4"
          >
            <PolarGrid />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "rgb(var(--foreground))" }}
            />
            <PolarRadiusAxis
              angle={30}
              tick={{ fill: "rgb(var(--foreground))" }}
            />
            <Radar
              name="Visites"
              dataKey="totalVisites"
              stroke="rgb(var(--chart))"
              fill="rgb(var(--chart))"
              fillOpacity={0.6}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </section>
    </>
  );
}
