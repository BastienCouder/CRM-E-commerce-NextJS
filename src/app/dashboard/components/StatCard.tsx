"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import formatPrice, { formatDateMonth } from "@/lib/format";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart2,
  BarChart3,
  Euro,
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface StatCardProps {
  title: string;
  data: any;
  value: string | number;
  secondaryText: string;
  type: "price" | "nbr";
  variant?: string;
}

export default function StatCard({
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

  const currentDate = new Date();
  const endDate = new Date(currentDate);
  const startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
  const filteredData = data.data.filter((data: any) => {
    const dataDate = new Date(data.date);
    return dataDate >= startDate && dataDate <= endDate;
  });

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
              <p className="flex flex-col text-xs text-muted-foreground">
                <span className="flex gap-x-1">
                  {!isNaN(number) && <IconComponent size={13} />}
                  {formattedSecondaryText}
                </span>
                <span> par rapport au mois dernier</span>
              </p>
            </div>
          </CardContent>
        </div>
        <div className="h-full flex items-center -ml-4">
          {variant === "bars" && <BarChart2 size={90} />}
        </div>
      </Card>
    </>
  );
}
