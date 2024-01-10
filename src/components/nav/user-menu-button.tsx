import { useDisableAnimation } from "@/hooks/useDisableAnimation";
import { User } from "lucide-react";
import Link from "next/link";

interface UserMenuButtonProps {
  toggleMenu: () => void;
  isSmallScreen: boolean;
}

export default function UserMenuButton({
  toggleMenu,
  isSmallScreen,
}: UserMenuButtonProps) {
  const { handleEnableAnimation } = useDisableAnimation();

  return (
    <Link
      href={`/login`}
      onClick={() => {
        toggleMenu();
        handleEnableAnimation();
      }}
    >
      {isSmallScreen ? (
        <User size={27} />
      ) : (
        <p className="text-base uppercase mt-2">mon compte</p>
      )}
    </Link>
  );
}
