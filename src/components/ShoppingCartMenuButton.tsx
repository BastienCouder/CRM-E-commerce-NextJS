"use client";
import Link from "next/link";
import { CartProps } from "@/lib/db/cart";
import { Badge } from "@/components/ui/badge";
import { useDisableAnimation } from "@/hooks/useDisableAnimation";
import { ShoppingBag } from "lucide-react";
import urls from "@/lib/data/url";

interface ShoppingCartMenuButtonProps {
  toggleMenu: () => void;
  cart: CartProps | null;
}

export default function ShoppingCartMenuButton({
  toggleMenu,
  cart,
}: ShoppingCartMenuButtonProps) {
  const { handleEnableAnimation } = useDisableAnimation();

  return (
    <Link
      href={`${urls.cart}`}
      onClick={() => {
        toggleMenu();
        handleEnableAnimation();
      }}
    >
      <ShoppingBag size={27} />
      <Badge className="absolute -top-1 -right-2">{cart?.size || 0}</Badge>
    </Link>
  );
}
