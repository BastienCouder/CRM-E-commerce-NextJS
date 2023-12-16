"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import formatPrice from "@/lib/format";
import {
  AreaChart,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart2,
  LineChart,
} from "lucide-react";

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
      <Card className="flex w-80">
        <div className="flex flex-col w-[14rem]">
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
                <span className="flex gap-x-1 font-bold text-secondary">
                  {!isNaN(number) && <IconComponent size={13} />}
                  {formattedSecondaryText}
                </span>
                <span> par rapport au mois dernier</span>
              </p>
            </div>
          </CardContent>
        </div>
        <div className="h-full flex items-center -ml-4">
          {variant === "bars" && (
            <BarChart2 size={90} color="rgb(var(--chart1))" />
          )}
          {variant === "area" && (
            <AreaChart size={90} color="rgb(var(--chart1))" />
          )}
          {variant === "line" && (
            <LineChart size={90} color="rgb(var(--chart1))" />
          )}
        </div>
      </Card>
    </>
  );
}
