import { getCart } from "@/lib/db/cart";
import Hamburger from "./HamburgerMenu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function NavBar() {
  const session = await getServerSession(authOptions);
  const cart = await getCart();
  return (
    <>
      <Hamburger cart={cart} session={session} />
    </>
  );
}
