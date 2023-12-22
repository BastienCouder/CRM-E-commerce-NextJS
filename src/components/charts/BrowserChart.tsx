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
    Netscape: "/svg/netscape.svg",
    Other: "/svg/other_browser.svg",
  };

  return images[browserName] || images["Other"];
}

export default function BrowserChart({ analyticsData }: BrowserChartProps) {
  console.log(analyticsData);

  return (
    <>
      <section className="w-[30rem] p-4 rounded-lg bg-card space-y-4">
        <h2>Navigateur</h2>
        <Separator />
        <ul className="space-y-4">
          {Object.entries(analyticsData.browsers).map(
            ([browser, data]: any) => (
              <li key={browser} className="flex gap-x-4 items-center">
                <Image
                  src={getBrowserImageUrl(browser)}
                  alt={browser}
                  width={100}
                  height={100}
                  className="h-[40px] w-[40px] bg-background p-2 rounded-lg"
                />
                <div>
                  <div className="w-full flex justify-between">
                    <p>{browser}</p>
                    <div className="flex gap-x-2 items-center">
                      <p className="text-sm">{data.count}</p>
                      <p className="font-bold">{data.percentage}%</p>
                    </div>
                  </div>
                  <div className="h-[15px] w-[350px] rounded-md bg-background">
                    <div
                      style={{
                        width: `${data.percentage}%`,
                        backgroundColor:
                          data.percentage > 50 ? "rgb(var(--chart))" : "red",
                      }}
                      className="h-full rounded-md text-background flex justify-start items-center pl-4"
                    />
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      </section>
    </>
  );
}
