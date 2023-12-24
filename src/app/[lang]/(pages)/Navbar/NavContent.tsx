"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import styles from "@/styles/Nav.module.css";
import ShoppingCartButton from "@/app/[lang]/(pages)/Navbar/components/ShoppingCartButton";
import UserMenuButton from "@/app/[lang]/(pages)/Navbar/components/UserMenuButton";
import { useDisableAnimation } from "@/hooks/useDisableAnimation";
import WishlistButton from "./components/WishlistButton";
import { CartProps } from "@/lib/db/cart";
import { Dictionary } from "@/app/[lang]/dictionaries/dictionaries";
import urls from "@/lib/data/url";

interface NavContentProps {
  toggleMenu: () => void;
  cart: CartProps | null;
  dict: Dictionary;
}

export default function NavContent({
  toggleMenu,
  cart,
  dict,
}: NavContentProps) {
  const mainNavData = [
    { name: `${dict.nav.home}`, path: `${urls.home}` },
    { name: `${dict.nav.collection}`, path: `${urls.store}` },
  ];

  const footerNavData = [
    { name: `${dict.nav.legal_information}`, path: `${urls.legal}` },
    {
      name: `${dict.nav.privacy_policy}`,
      path: `${urls.privacy}`,
    },
    {
      name: `${dict.nav.cookie_policy}`,
      path: `${urls.cookies}`,
    },
    {
      name: `${dict.nav.refund_policy}`,
      path: `${urls.refund}`,
    },
  ];

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
    <div className="z-40 fixed h-screen w-screen flex flex-col justify-between bg-card top-0 left-0">
      <div className="flex space-x-6 text-[2rem] md:text-[2.5rem] absolute top-7 md:top-6 right-24">
        <motion.div {...iconProfileMotionProps} className="flex items-center">
          <UserMenuButton
            toggleMenu={toggleMenu}
            isSmallScreen={isSmallScreen}
          />
        </motion.div>
        <div className="flex gap-x-4 mt-1">
          <motion.div {...iconShopMotionProps}>
            <WishlistButton toggleMenu={toggleMenu} />
          </motion.div>
          <motion.div {...iconShopMotionProps}>
            <ShoppingCartButton toggleMenu={toggleMenu} cart={cart} />
          </motion.div>
        </div>
      </div>
      <div className="h-[2rem]"></div>

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
                  <div className={`flex items-center${styles.name}`}>
                    {"" === link.path ? (
                      <div className={styles.path}></div>
                    ) : (
                      <div className={styles.bar}></div>
                    )}
                    <p className="first-letter:uppercase">{link.name}</p>
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
            <h2 className="text-[1.8rem] capitalize">{dict.nav.contact}</h2>
            <div className="hidden md:flex md:flex-col">
              <p>Email : example@example.com</p>
              <p>Téléphone : (123) 456-7890</p>
            </div>
          </div>
          <div className="text-white flex flex-col items-center md:items-start">
            <h2 className="text-[1.8rem]">Infos</h2>
            <div className="hidden md:flex md:flex-col">
              <p>addresse : [...]</p>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="w-full flex flex-col md:flex-row flex-wrap items-center px-6 md:px-20 mb-8 gap-x-12 gap-y-4 text-sm">
        <ul className="gap-y-2  gap-x-8 flex flex-col md:flex-row items-center md:items-start">
          {footerNavData.map((link, index) => (
            <motion.li
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: 20,
              }}
              transition={{ duration: 0.4 }}
              key={index}
              className="flex relative"
            >
              <Link
                href={link.path}
                onClick={() => {
                  toggleMenu();
                  handleEnableAnimation();
                }}
              >
                <div className={`flex items-center border-b`}>{link.name}</div>
              </Link>
            </motion.li>
          ))}
        </ul>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: 20,
          }}
          transition={{ duration: 0.4 }}
        >
          &copy; 2023 Bastien Couder
        </motion.p>
      </div>
    </div>
  );
}
