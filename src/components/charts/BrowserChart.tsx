"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface BrowserChartProps {
  analyticsData: any;
}

function getBrowserImageUrl(browserName: string): string {
  const images: Record<string, string> = {
    Chrome: "/svg/chrome.svg",
    Edge: "/svg/edge.svg",
    Safari: "/svg/safari.svg",
    Opera: "/svg/opera.svg",
    Firefox: "/svg/firefox.svg",
    IE: "/svg/internet_explorer.svg",
    Other: "/svg/web.svg",
  };

  return images[browserName] || images["Other"];
}

export default function BrowserChart({ analyticsData }: BrowserChartProps) {
  const defaultBrowsers = {
    Chrome: { count: 0, percentage: 0 },
    Edge: { count: 0, percentage: 0 },
    Safari: { count: 0, percentage: 0 },
    Opera: { count: 0, percentage: 0 },
    Firefox: { count: 0, percentage: 0 },
    IE: { count: 0, percentage: 0 },
    Other: { count: 0, percentage: 0 },
  };

  const browserData = { ...defaultBrowsers, ...analyticsData.browsers };
  return (
    <>
      <section className="border w-[28rem] p-4 rounded-lg bg-card space-y-4">
        <h2>Navigateur</h2>
        <Separator className="bg-[rgba(var(--foreground),0.5)]" />
        <ul className="space-y-4">
          {Object.entries(browserData).map(([browser, data]: any) => (
            <li key={browser} className="flex gap-x-4 items-center">
              <Image
                src={getBrowserImageUrl(browser)}
                alt={browser}
                width={100}
                height={100}
                className="h-[40px] w-[40px] bg-background p-2 rounded-lg"
              />
              <div className="w-full">
                <div className="w-full flex justify-between">
                  <p>{browser}</p>
                  <div className="flex gap-x-2 items-center">
                    <p className="text-sm">{data.count}</p>
                    <p className="font-bold">{data.percentage}%</p>
                  </div>
                </div>
                <div className="h-[13px] w-full rounded-md bg-background">
                  <div
                    style={{
                      width: `${data.percentage}%`,
                    }}
                    className="bg-chart h-full rounded-md text-background flex justify-start items-center pl-4"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
