"use client";
import { Monitor, Smartphone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ReactElement } from "react";

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

export default function DeviceChart({ analyticsData }: DeviceChartProps) {
  const defaultDevice = {
    mobile: { count: 0, percentage: 0 },
    desktop: { count: 0, percentage: 0 },
  };
  const deviceData = { ...defaultDevice, ...analyticsData.devices };

  function getDeviceIcon(device: string): ReactElement | null {
    const icons: Record<string, ReactElement> = {
      mobile: <Smartphone size={20} color="rgb(var(--chart))" />,
      desktop: <Monitor size={20} color="rgb(var(--chart))" />,
    };

    return icons[device] || null;
  }

  return (
    <>
      <section className="w-[15rem] p-4 rounded-lg bg-card space-y-4">
        <h2>Plateforme</h2>
        <Separator className="bg-[rgba(var(--foreground),0.5)]" />
        <ul className="space-y-4">
          {Object.entries(deviceData).map(([device, data]) => (
            <li key={device} className="w-full flex gap-x-4 items-center">
              <div className="bg-background p-2 rounded-lg">
                {getDeviceIcon(device)}
              </div>

              <div className="w-full flex justify-between">
                <p>{device}</p>
                <p className="font-bold">{data.percentage}%</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
