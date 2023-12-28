"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import formatPrice from "@/helpers/format";
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
        return <DollarSign className="bg-background p-1 rounded-lg" />;
      case "trening":
        return <TrendingUpIcon className="bg-background p-1 rounded-lg" />;
      case "zap":
        return <Zap className="bg-background p-1 rounded-lg" />;
      case "eye":
        return <Eye className="bg-background p-1 rounded-lg" />;
      default:
        return null;
    }
  }

  return (
    <>
      <Card className="max-w-[250px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-1">
          <CardTitle className="flex items-center gap-x-2 text-sm w-[12rem]">
            {title}
          </CardTitle>
          {renderIcon(variant!)}
        </CardHeader>
        <CardContent className="flex flex-col">
          <div className="text-xl font-bold">
            {type === "price" ? formatPrice(Number(value), "EUR") : value}
          </div>
          <p className="flex flex-col text-xs">
            <span className={`flex items-center gap-x-1 font-bold text-chart`}>
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
