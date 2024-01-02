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
  AnalyticsWishlistCartOrder,
  readAnalyticsWishlistCartOrderProps,
} from "@/app/dashboard/management/products/action";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/schemas/DbSchema";

interface WhislistCartOrderLengthProps {
  analyticsData: readAnalyticsWishlistCartOrderProps;
}

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { payload: AnalyticsWishlistCartOrder }[];
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;
  const { wishlistCount, cartCount, orderCount } = payload[0].payload;
  let dataToDisplay;
  switch (label) {
    case "J'aime":
    case "J'aimes":
      dataToDisplay = `${wishlistCount}`;
      break;
    case "Mise en Panier":
      dataToDisplay = `${cartCount}`;
      break;
    case "Commander":
      dataToDisplay = `${orderCount}`;
      break;
    default:
      dataToDisplay = "Donnée non disponible";
  }

  return (
    <div className="p-3 text-background text-sm bg-foreground rounded-lg">
      <p className="font-bold">{label}</p>
      <p>Total :{dataToDisplay}</p>
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
    () => data.sort((a: Product, b: Product) => a.name.localeCompare(b.name)),
    [data]
  );

  const selectedProduct = useMemo(
    () =>
      sortedData.find(
        (item: Product) => item.productId === selectedProductId
      ) || sortedData[0],
    [selectedProductId, sortedData]
  );

  const chartData = useMemo(
    () => [
      {
        subject: selectedProduct?.wishlistCount > 1 ? "J'aimes" : "J'aime",
        A: selectedProduct?.wishlistCount,
        fullMark: 100,
        ...selectedProduct,
      },
      {
        subject: "Mise en Panier",
        A: selectedProduct?.cartCount,
        fullMark: 100,
        ...selectedProduct,
      },
      {
        subject: "Commander",
        A: selectedProduct?.orderCount,
        fullMark: 100,
        ...selectedProduct,
      },
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
            <SelectValue placeholder={selectedProduct?.name} />
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
            stroke="rgb(var(--chart))"
            fill="rgb(var(--chart))"
            fillOpacity={0.6}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </>
  );
}
