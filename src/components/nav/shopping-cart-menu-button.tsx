"use client";
import Link from "next/link";
import { CartProps } from "@/lib/db/cart";
import { Badge } from "@/components/ui/badge";
import { useDisableAnimation } from "@/hooks/useDisableAnimation";
import { ShoppingBag } from "lucide-react";
import routes from "@/lib/data/routes.json";

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
      href={`${routes.cart}`}
      onClick={() => {
        toggleMenu();
        handleEnableAnimation();
      }}
    >
      <ShoppingBag size={27} />
      <Badge className="absolute -top-1 -right-3">
        {(cart && cart.size) || 0}
      </Badge>
    </Link>
  );
}
