"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ProductAnalytics {
  productId: string;
  name: string;
  wishlistCount: number;
  cartCount: number;
  orderCount: number;
}

interface WhislistCartOrderLengthProps {
  analyticsData: { data: ProductAnalytics[] };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3">
        <p className="text-background">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default function WhislistCartOrderLength({
  analyticsData: { data },
}: WhislistCartOrderLengthProps) {
  const [selectedProductId, setSelectedProductId] = useState(() =>
    data.length ? data[Math.floor(Math.random() * data.length)].productId : ""
  );

  const selectedProduct = useMemo(
    () => data.find((item) => item.productId === selectedProductId) || data[0],
    [selectedProductId, data]
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
      {
        subject: "Commander",
        A: selectedProduct.orderCount,
        fullMark: 100,
      },
    ],
    [selectedProduct]
  );

  const handleSelectChange = useCallback((event: any) => {
    setSelectedProductId(event.target.value);
  }, []);

  return (
    <>
      <h2 className="mb-2">Total des interactions produit</h2>
      <div className="mb-4">
        <select
          value={selectedProductId}
          onChange={handleSelectChange}
          className="w-[250px] p-2 bg-background rounded-lg outline-none"
        >
          {data
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((product) => (
              <option
                key={product.productId}
                value={product.productId}
                className="bg-background"
              >
                {product.name}
              </option>
            ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} />
          <Radar
            name="Metrics"
            dataKey="A"
            stroke="#fff"
            fill="#fff"
            fillOpacity={0.6}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </>
  );
}
