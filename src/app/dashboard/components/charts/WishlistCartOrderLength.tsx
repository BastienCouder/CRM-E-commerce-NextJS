"use client";
import { useEffect, useState, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  AnalyticsProductsData,
  useServerReadAnalyticsWishlistCartOrderProps,
} from "../../products/action";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WhislistCartOrderLengthProps {
  analyticsData: useServerReadAnalyticsWishlistCartOrderProps;
}

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { payload: AnalyticsProductsData }[];
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;
  const { totalSales } = payload[0].payload;

  return (
    <div className="bg-white p-3">
      <p className="text-background">{`${label} : ${totalSales}`}</p>
    </div>
  );
};

export default function WhislistCartOrderLength({
  analyticsData: { data },
}: WhislistCartOrderLengthProps) {
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    setSelectedProductId(
      data.length ? data[Math.floor(Math.random() * data.length)].productId : ""
    );
  }, [data]);

  const sortedData = useMemo(
    () => data.sort((a, b) => a.name.localeCompare(b.name)),
    [data]
  );

  const selectedProduct = useMemo(
    () =>
      sortedData.find((item) => item.productId === selectedProductId) ||
      sortedData[0],
    [selectedProductId, sortedData]
  );

  const chartData = useMemo(
    () => [
      {
        subject: selectedProduct.wishlistCount > 1 ? "J'aimes" : "J'aime",
        A: selectedProduct.wishlistCount,
        fullMark: 100,
      },
      {
        subject: "Mise en Panier",
        A: selectedProduct.cartCount,
        fullMark: 100,
      },
      { subject: "Commander", A: selectedProduct.orderCount, fullMark: 100 },
    ],
    [selectedProduct]
  );

  const handleSelectChange = (value: string) => {
    setSelectedProductId(value);
  };

  return (
    <>
      <h2 className="mb-2">Total des interactions produit</h2>
      <div className="mb-4">
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px] rounded-lg">
            <SelectValue placeholder={selectedProduct.name} />
          </SelectTrigger>
          <SelectContent>
            {sortedData.map((product) => (
              <SelectItem key={product.productId} value={product.productId}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "rgb(var(--foreground))" }}
          />
          <PolarRadiusAxis
            angle={30}
            tick={{ fill: "rgb(var(--foreground))" }}
          />
          <Radar
            name="Metrics"
            dataKey="A"
            stroke="rgb(var(--chart1))"
            fill="rgb(var(--chart1))"
            fillOpacity={0.6}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </>
  );
}
