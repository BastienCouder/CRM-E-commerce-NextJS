import formatPrice from "@/helpers/format";

interface PriceTagProps {
  price: number;
  className?: string;
}

export default function PriceTag({ price, className }: PriceTagProps) {
  return <span className={`${className}`}>{formatPrice(price, "EUR")}</span>;
}
