"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import formatPrice from "../../../format";
import {
  AreaChart,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart2,
  DollarSign,
  Eye,
  LineChart,
  StoreIcon,
  TrendingUpIcon,
  Zap,
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

  function renderIcon(variant: string) {
    switch (variant) {
      case "dollars":
        return (
          <DollarSign
            className="bg-background p-1 rounded-lg"
            color="rgb(var(--chart))"
          />
        );
      case "trening":
        return (
          <TrendingUpIcon
            className="bg-background p-1 rounded-lg"
            color="rgb(var(--chart))"
          />
        );
      case "zap":
        return (
          <Zap
            className="bg-background p-1 rounded-lg"
            color="rgb(var(--chart))"
          />
        );
      case "eye":
        return (
          <Eye
            className="bg-background p-1 rounded-lg"
            color="rgb(var(--chart))"
          />
        );
      default:
        return null;
    }
  }

  return (
    <>
      <Card className="max-w-[250px] flex flex-col">
        <CardHeader className="pt-2 pb-0 px-4 flex flex-row items-center justify-between pb-1">
          <CardTitle className="flex items-center gap-x-2 text-sm w-[12rem]">
            {title}
          </CardTitle>
          {renderIcon(variant!)}
        </CardHeader>
        <CardContent className="pb-4 pt-0 px-4 flex flex-col">
          <div className="text-xl font-bold">
            {type === "price" ? formatPrice(Number(value), "EUR") : value}
          </div>
          <p className="flex flex-col text-xs">
            <span
              className={`flex items-center gap-x-1 font-bold ${
                isPositive ? "text-green-700" : "text-red-700"
              }`}
            >
              {!isNaN(number) && <IconComponent size={13} />}
              {formattedSecondaryText}
            </span>
            <span> par rapport au mois dernier</span>
          </p>
        </CardContent>
      </Card>
    </>
  );
}
