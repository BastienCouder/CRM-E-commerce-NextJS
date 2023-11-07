"use client";
import React, { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import styles from "@/styles/Hamburger.module.css";
import NavPage from "@/app/pages/Navbar/Navpage";
import { CartProps } from "@/lib/db/cart";
import { Session } from "next-auth";

interface HamburgerMenuProps {
  cart: CartProps | null;
  session: Session | null;
}
export default function HamburgerMenu({ cart, session }: HamburgerMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  }, []);

  const buttonClass = isMenuOpen
    ? `${styles["burger-button"]} ${styles["active"]}`
    : styles["burger-button"];

  return (
    <>
      <div className={styles.navbar}>
        {!isMenuOpen && <div className={styles.navTitle}>Menu</div>}
        <button aria-label="menu" onClick={toggleMenu} className={buttonClass}>
          <div className={styles.bar1}></div>
          <div className={styles.bar2}></div>
          <div className={styles.bar3}></div>
        </button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <div>
            <NavPage toggleMenu={toggleMenu} cart={cart} session={session} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
