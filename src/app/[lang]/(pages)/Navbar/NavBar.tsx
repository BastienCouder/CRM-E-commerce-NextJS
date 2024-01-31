"use client";
import React, { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import styles from "@/styles/Hamburger.module.css";
import { CartProps } from "@/lib/db/cart";
import { usePathname } from "next/navigation";
import { Dictionary } from "@/lang/dictionaries";
import NavContent from "./NavContent";
import { Category } from "@/schemas/db-schema";
import { Session } from "next-auth";

interface NavBarProps {
  categories: Category[];
  cart: CartProps;
  dict: Dictionary;
  session: Session | null;
}
export default function NavBar({
  cart,
  dict,
  categories,
  session,
}: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  }, []);

  const buttonClass = isMenuOpen
    ? `${styles["burger-button"]} ${styles["active"]}`
    : styles["burger-button"];

  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboardPage && (
        <>
          <div className={styles.navbar}>
            {!isMenuOpen && (
              <div className={styles.navTitle}>{dict.nav.menu}</div>
            )}
            <button
              aria-label={dict.nav.menu}
              onClick={toggleMenu}
              className={buttonClass}
            >
              <div className={styles.bar1}></div>
              <div className={styles.bar2}></div>
              <div className={styles.bar3}></div>
            </button>
          </div>
          <AnimatePresence>
            {isMenuOpen && (
              <div>
                <NavContent
                  toggleMenu={toggleMenu}
                  cart={cart}
                  dict={dict}
                  categories={categories}
                  session={session}
                />
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
