"use client";
import formatPrice, { formatDateMonth } from "@/lib/format";
import styles from "../../../styles/CustomTooltip.module.css";
interface CustomTooltipProps {
  active?: any;
  payload: any;
  type: string;
}

const CustomTooltip = ({ active, payload, type }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipDetails}>
          <p className={styles.label}>
            {formatDateMonth(payload[0].payload.date, "long")}
          </p>
          {type === "price" && (
            <>
              {payload[0].payload.subtotal ? (
                <p>Total {formatPrice(payload[0].payload.subtotal, "EUR")}</p>
              ) : (
                <p>Aucune ventes</p>
              )}
            </>
          )}
          {type === "nbr" && (
            <>
              {payload[0].payload.orderItems ? (
                <p>Total {payload[0].payload.orderItems}</p>
              ) : (
                <p>Aucune ventes</p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
