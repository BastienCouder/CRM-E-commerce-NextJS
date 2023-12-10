"use client";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import formatPrice, { formatDateMonth } from "@/lib/format";
import styles from "../../../styles/CustomTooltip.module.css";

interface SaleLenghtChartProps {
  analyticsData: any;
}

interface CustomTooltipProps {
  active?: any;
  payload: any;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipDetails}>
          <p className={styles.label}>
            {formatDateMonth(payload[0].payload.date, "long")}
          </p>

          {payload[0].payload.orderItems ? (
            <p>Total {payload[0].payload.orderItems}</p>
          ) : (
            <p>Aucune ventes</p>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default function SaleLenghtChart({
  analyticsData,
}: SaleLenghtChartProps) {
  const { Data, maxOrderItems } = analyticsData;

  return (
    <>
      <h2 className="mb-2">Nombres de commandes</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={Data}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatDateMonth(value, "short")}
            style={{
              fontSize: "0.8rem",
              fontFamily: "Arial",
            }}
            tickLine={false}
            axisLine={true}
          />
          <YAxis
            domain={[0, maxOrderItems + maxOrderItems / 4]}
            scale="linear"
            tickLine={false}
            style={{
              fontSize: "0.8rem",
              fontFamily: "Arial",
            }}
            axisLine={true}
          />

          <Tooltip
            cursor={{ fill: "#202020" }}
            content={<CustomTooltip payload={Data} />}
          />

          <Bar dataKey="orderItems" fill="#f5f5f5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
