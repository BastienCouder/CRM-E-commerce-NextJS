import Link from "next/link";
import { useDisableAnimation } from "@/hooks/useDisableAnimation";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  toggleMenu: () => void;
}

export default function WishlistButton({ toggleMenu }: WishlistButtonProps) {
  const { handleEnableAnimation } = useDisableAnimation();

  return (
    <Link
      href={`/wishlist`}
      onClick={() => {
        toggleMenu();
        handleEnableAnimation();
      }}
    >
      <Heart size={30} className="mt-1" />
    </Link>
  );
}
