"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import formatPrice from "@/lib/format";
import { BarChart2, Euro } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  secondaryText: string;
  type: string;
}

export default function StatCard({
  title,
  value,
  secondaryText,
  type,
}: StatCardProps) {
  const formatSecondaryText = (text: string) => {
    const number = parseFloat(text);
    if (isNaN(number)) return text;
    const sign = number >= 0 ? "+" : "";
    return `${sign}${number.toFixed(2)}%`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {type == "price" && (
          <>
            <Euro />
          </>
        )}
        {type == "nbr" && (
          <>
            <BarChart2 />
          </>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">
          {type == "price" && (
            <>
              {typeof value === "number"
                ? `${formatPrice(value, "EUR")}`
                : value}
            </>
          )}
          {type == "nbr" && (
            <>{typeof value === "number" ? `${value}` : value}</>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatSecondaryText(secondaryText)}{" "}
          <span> par rapport au mois dernier</span>
        </p>
      </CardContent>
    </Card>
  );
}
