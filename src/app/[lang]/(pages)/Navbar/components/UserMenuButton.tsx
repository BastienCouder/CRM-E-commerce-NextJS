import { useDisableAnimation } from "@/hooks/useDisableAnimation";
import { User } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";

interface UserMenuButtonProps {
  session: Session | null;
  toggleMenu: () => void;
  isSmallScreen: boolean;
}

export default function UserMenuButton({
  toggleMenu,
  session,
  isSmallScreen,
}: UserMenuButtonProps) {
  const user = session?.user;
  const { handleEnableAnimation } = useDisableAnimation();

  return user ? (
    <Link
      href={`/profile`}
      onClick={() => {
        toggleMenu();
        handleEnableAnimation();
      }}
    >
      {isSmallScreen ? (
        <User size={34} />
      ) : (
        <p className="text-base uppercase mt-2">mon compte</p>
      )}
    </Link>
  ) : (
    <Link
      href={`/login`}
      onClick={() => {
        toggleMenu();
        handleEnableAnimation();
      }}
    >
      {isSmallScreen ? (
        <User size={34} />
      ) : (
        <p className="text-base uppercase mt-2">mon compte</p>
      )}
    </Link>
  );
}
