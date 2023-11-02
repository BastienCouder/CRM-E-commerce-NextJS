"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import styles from "@/styles/Nav.module.css";
import ShoppingCartButton from "@/app/pages/Navbar/components/ShoppingCartButton";
import { ShoppingCart } from "@/lib/db/cart";
import UserMenuButton from "@/app/pages/Navbar/components/UserMenuButton";
import { Session } from "next-auth";
import { useDisableAnimation } from "@/hooks/useDisableAnimation";
import WishlistButton from "./components/WishlistButton";

interface NavBarProps {
  toggleMenu: () => void;
  cart: ShoppingCart | null;
  session: Session | null;
}

const mainNavData = [
  { name: "Accueil", path: "/" },
  { name: `Collection`, path: "/collection" },
  {
    name: "Catégorie 3",
    path: "/wishlist",
  },
];

export default function NavPage({ toggleMenu, cart, session }: NavBarProps) {
  const { handleEnableAnimation } = useDisableAnimation();
  const isSmallScreen = window.innerWidth <= 768;

  const iconProfileMotionProps = isSmallScreen
    ? {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
        transition: { delay: 0.05, duration: 0.2 },
      };

  const iconShopMotionProps = isSmallScreen
    ? {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
        transition: { duration: 0.2, damping: 10 },
      };

  const navMotionProps = isSmallScreen
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.4 },
      }
    : {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.4 },
      };

  const contactMotionProps = isSmallScreen
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.4 },
      }
    : {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
        transition: { duration: 0.4 },
      };

  return (
    <div className="z-40 fixed h-screen w-screen bg-zinc-900 top-0 left-0">
      <div className="flex space-x-6 text-[2rem] md:text-[2.5rem] absolute top-7 md:top-6 right-24">
        <motion.div {...iconProfileMotionProps} className="flex items-center">
          <UserMenuButton
            toggleMenu={toggleMenu}
            session={session}
            isSmallScreen={isSmallScreen}
          />
        </motion.div>
        <motion.div {...iconShopMotionProps}>
          <WishlistButton toggleMenu={toggleMenu} />
        </motion.div>
        <motion.div {...iconShopMotionProps}>
          <ShoppingCartButton toggleMenu={toggleMenu} cart={cart} />
        </motion.div>
      </div>
      <div className="h-[11rem] md:h-[15rem]"></div>

      <div className="w-full flex flex-col justify-between items-center md:items-start md:flex-row md:justify-around">
        <motion.nav {...navMotionProps} className="md:w-1/4">
          <ul className="space-y-8 text-white flex flex-col items-center text-[1.8rem] md:items-start">
            {mainNavData.map((link, index) => (
              <li key={index} className="flex relative">
                <Link
                  href={link.path}
                  onClick={() => {
                    toggleMenu();
                    handleEnableAnimation();
                  }}
                >
                  <div className={`flex items-center ${styles.name}`}>
                    {"" === link.path ? (
                      <div className={styles.path}></div>
                    ) : (
                      <div className={styles.bar}></div>
                    )}
                    {link.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
        <motion.div
          {...contactMotionProps}
          className="w-1/4 flex-col mt-8 md:mt-0 space-y-8"
        >
          <div className="text-white flex flex-col items-center md:items-start">
            <h2 className="text-[1.8rem]">Contact</h2>
            <div className="hidden md:flex md:flex-col">
              <p>Email : example@example.com</p>
              <p>Téléphone : (123) 456-7890</p>
            </div>
          </div>
          <div className="text-white flex flex-col items-center md:items-start">
            <h2 className="text-[1.8rem]">Infos</h2>
            <div className="hidden md:flex md:flex-col">
              <p>Email : example@example.com</p>
              <p>Téléphone : (123) 456-7890</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
