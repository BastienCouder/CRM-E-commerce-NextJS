"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import formatPrice from "@/helpers/format";
import {
  AreaChart,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart2,
  LineChart,
} from "lucide-react";
import Image from "next/image";

interface StatCardProps {
  title: string;
  data: any;
  value: string | number;
  secondaryText: string;
  type: "price" | "nbr";
  variant?: string;
}

export default function StatsCard({
  title,
  data,
  value,
  secondaryText,
  type,
  variant,
}: StatCardProps) {
  const number = parseFloat(secondaryText);
  const isPositive = !isNaN(number) && number >= 0;
  const formattedSecondaryText = !isNaN(number)
    ? `${isPositive ? "+" : ""}${number.toFixed(2)}%`
    : secondaryText;

  const IconComponent = isPositive ? ArrowUpCircle : ArrowDownCircle;

  return (
    <>
      <Card className="flex">
        <div className="flex flex-col w-2/3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-x-2 text-sm w-[12rem]">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex">
            <div>
              <div className="text-xl font-bold">
                {type === "price" ? formatPrice(Number(value), "EUR") : value}
              </div>
              <p className="flex flex-col text-xs ">
                <span
                  className={`flex gap-x-1 font-bold ${
                    variant === "bars"
                      ? "text-chart1"
                      : variant === "area"
                      ? "text-chart2"
                      : "text-chart3"
                  }`}
                >
                  {!isNaN(number) && <IconComponent size={13} />}
                  {formattedSecondaryText}
                </span>
                <span> par rapport au mois dernier</span>
              </p>
            </div>
          </CardContent>
        </div>
        <div className=" w-1/3 h-full flex items-center -ml-4">
          {variant === "bars" && (
            <svg
              height={80}
              width={120}
              viewBox="0 0 2000 1000"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 1000h177.778V614.615q0-20-20-20H20q-20 0-20 20ZM222.222 1000H400V592.937q0-20-20-20H242.222q-20 0-20 20ZM444.444 1000h177.778V330.057q0-20-20-20H464.444q-20 0-20 20ZM666.667 1000h177.777V673.908q0-20-20-20H686.667q-20 0-20 20ZM888.889 1000h177.778V129.786q0-20-20-20H908.889q-20 0-20 20ZM1111.111 1000h177.778V666.191q0-20-20-20H1131.11q-20 0-20 20ZM1333.333 1000h177.778V601.071q0-20-20-20h-137.778q-20 0-20 20ZM1555.556 1000h177.777V306.354q0-20-20-20h-137.777q-20 0-20 20ZM1777.778 1000h177.778V316.087q0-20-20-20h-137.778q-20 0-20 20Z"
                fill="rgb(var(--chart1))"
              />
            </svg>
          )}
          {variant === "area" && (
            <svg
              height={80}
              width={120}
              viewBox="0 0 2000 1000"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 502.342c25-5.699 75 28.031 125-28.493 50-56.525 75-269.891 125-254.13 50 15.762 75 351.69 125 332.939 50-18.752 75-461.675 125-426.698 50 34.977 75 467.083 125 601.585 50 134.501 75 170.853 125 70.923s75-448.638 125-570.573c50-121.936 75-34.631 125-39.106 50-4.474 75 8.94 125 16.734 50 7.794 75-62.19 125 22.237 50 84.427 75 350.226 125 399.896 50 49.67 75-102.81 125-151.544 50-48.736 75-70.607 125-92.132 50-21.525 75 37.52 125-15.495 50-53.017 75-218.997 125-249.586 50-30.59 100 77.312 125 96.64V1000H0Z"
                fill="rgb(var(--chart2))"
              />
              <path
                d="M0 502.342c25-5.699 75 28.031 125-28.493 50-56.525 75-269.891 125-254.13 50 15.762 75 351.69 125 332.939 50-18.752 75-461.675 125-426.698 50 34.977 75 467.083 125 601.585 50 134.501 75 170.853 125 70.923s75-448.638 125-570.573c50-121.936 75-34.631 125-39.106 50-4.474 75 8.94 125 16.734 50 7.794 75-62.19 125 22.237 50 84.427 75 350.226 125 399.896 50 49.67 75-102.81 125-151.544 50-48.736 75-70.607 125-92.132 50-21.525 75 37.52 125-15.495 50-53.017 75-218.997 125-249.586 50-30.59 100 77.312 125 96.64"
                fill="none"
              />
            </svg>
          )}
          {variant === "line" && (
            <svg
              height={100}
              width={120}
              viewBox="0 0 2000 1000"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m0 351.2 125 266.098 125 23.1 125-180.12 125-192.323L625 795.23l125-611.162 125 61.913 125 203.69 125 188.88 125-145.363 125 93.973 125 162.54 125-387.644 125 200.421 125 65.86 125-154.408V1000H0Z"
                fill="none"
              />
              <path
                d="m0 351.2 125 266.098 125 23.1 125-180.12 125-192.323L625 795.23l125-611.162 125 61.913 125 203.69 125 188.88 125-145.363 125 93.973 125 162.54 125-387.644 125 200.421 125 65.86 125-154.408"
                fill="none"
                stroke="rgb(var(--chart3))"
                strokeWidth="10"
              />
              <g fill="rgb(var(--chart3))">
                <circle cy="351.201" r="14" />
                <circle cx="125" cy="617.298" r="14" />
                <circle cx="250" cy="640.398" r="14" />
                <circle cx="375" cy="460.278" r="14" />
                <circle cx="500" cy="267.955" r="14" />
                <circle cx="625" cy="795.23" r="14" />
                <circle cx="750" cy="184.068" r="14" />
                <circle cx="875" cy="245.981" r="14" />
                <circle cx="1000" cy="449.672" r="14" />
                <circle cx="1125" cy="638.551" r="14" />
                <circle cx="1250" cy="493.188" r="14" />
                <circle cx="1375" cy="587.161" r="14" />
                <circle cx="1500" cy="749.7" r="14" />
                <circle cx="1625" cy="362.057" r="14" />
                <circle cx="1750" cy="562.478" r="14" />
                <circle cx="1875" cy="628.339" r="14" />
                <circle cx="2000" cy="473.93" r="14" />
              </g>
            </svg>
          )}
        </div>
      </Card>
    </>
  );
}
