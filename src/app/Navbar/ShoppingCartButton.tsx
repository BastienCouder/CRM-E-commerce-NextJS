import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import { ShoppingCart } from "@/lib/db/cart";

interface ShoppingCartButtonProps {
  toggleMenu: () => void;
  cart: ShoppingCart | null;
}

export default function ShoppingCartButton({
  toggleMenu,
  cart,
}: ShoppingCartButtonProps) {
  return (
    <Link href={`/cart`} onClick={toggleMenu}>
      <AiOutlineShopping size={34} />
      <span className="absolute top-0 -right-2 badge badge-sm">
        {cart?.size || 0}
      </span>
    </Link>
  );
}
