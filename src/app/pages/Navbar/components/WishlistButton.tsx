import Link from "next/link";
import { AiOutlineHeart } from "react-icons/ai";
import { useDisableAnimation } from "@/hooks/useDisableAnimation";

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
      <AiOutlineHeart size={34} />
    </Link>
  );
}
