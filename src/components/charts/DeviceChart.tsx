"use client";
import { Monitor, Smartphone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ReactElement } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

interface DeviceData {
  count: number;
  percentage: number;
}

interface DeviceStats {
  [key: string]: DeviceData;
}

interface DeviceChartProps {
  analyticsData: {
    devices: DeviceStats;
  };
}

const Style = { fontSize: "0.8rem", fill: "rgb(var(--foreground))" };

export default function DeviceChart({ analyticsData }: DeviceChartProps) {
  const defaultDevice = {
    mobile: { count: 0, percentage: 50 },
    desktop: { count: 0, percentage: 50 },
  };

  const deviceData = { ...defaultDevice, ...analyticsData.devices };

  const COLORS = ["rgb(var(--foreground))", "rgb(var(--primary))"];

  const pieChartData = Object.entries(deviceData).map(([key, value], index) => {
    return {
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value.percentage,
    };
  });

  return (
    <>
      <section className="border w-1/3 h-[14rem] p-4 rounded-lg bg-card space-y-4">
        <h2>Plateforme utilisées</h2>
        <Separator className="bg-[rgba(var(--foreground),0.5)]" />

        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={200} className="pt-6">
            <Legend verticalAlign="top" />
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={pieChartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill={Style.fill}
              paddingAngle={15}
              label
              stroke="none"
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </section>
    </>
  );
}
