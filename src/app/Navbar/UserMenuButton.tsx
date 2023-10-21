import { Session } from "next-auth";
import Logout from "@/components/Logout";
import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";

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
  return user ? (
    <Link href={`/profile`} onClick={toggleMenu}>
      {isSmallScreen ? (
        <AiOutlineUser size={34} />
      ) : (
        <p className="text-base uppercase mt-2">mon compte</p>
      )}
    </Link>
  ) : (
    <Link href={`/auth`} onClick={toggleMenu}>
      {isSmallScreen ? (
        <AiOutlineUser size={34} />
      ) : (
        <p className="text-base uppercase mt-2">mon compte</p>
      )}
    </Link>
  );
}
