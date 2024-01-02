import formatPrice from "@/lib/format";

interface PriceTagProps {
  price: number;
  locale: string;
  className?: string;
}

export default function PriceTag({ price, locale, className }: PriceTagProps) {
  return <span className={className}>{formatPrice(price, locale)}</span>;
}
