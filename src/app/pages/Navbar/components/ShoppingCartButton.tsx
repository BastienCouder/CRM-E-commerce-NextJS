import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import { CartProps } from "@/lib/db/cart";
import { Badge } from "@/components/ui/badge";
import { useDisableAnimation } from "@/hooks/useDisableAnimation";

interface ShoppingCartButtonProps {
  toggleMenu: () => void;
  cart: CartProps | null;
}

export default function ShoppingCartButton({
  toggleMenu,
  cart,
}: ShoppingCartButtonProps) {
  const { handleEnableAnimation } = useDisableAnimation();

  return (
    <Link
      href={`/cart`}
      onClick={() => {
        toggleMenu();
        handleEnableAnimation();
      }}
    >
      <AiOutlineShopping size={34} />
      <Badge className="absolute top-0 -right-2">{cart?.size || 0}</Badge>
    </Link>
  );
}
