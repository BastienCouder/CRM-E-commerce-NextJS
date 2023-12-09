import formatPrice, { formatDateMonth } from "@/lib/format";
import styles from "../../../styles/CustomTooltip.module.css";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipDetails}>
          <p className={styles.label}>
            {formatDateMonth(payload[0].payload.date, "long")}
          </p>
          {payload[0].payload.subtotal ? (
            <p>Total {formatPrice(payload[0].payload.subtotal, "EUR")}</p>
          ) : (
            <p>Aucune ventes</p>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
