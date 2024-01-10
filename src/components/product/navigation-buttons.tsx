"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import styles from "@/styles/keyframes.module.css";
import { motion } from "framer-motion";

interface NavigationButtonsProps {
  goToPrev: () => void;
  goToNext: () => void;
  handleSecondAnimation: () => void;
  children?: ReactNode;
}

export default function NavigationButtons({
  goToPrev,
  goToNext,
  handleSecondAnimation,
  children,
}: NavigationButtonsProps) {
  const handlePrevClick = () => {
    handleSecondAnimation();
    goToPrev();
  };

  const handleNextClick = () => {
    handleSecondAnimation();
    goToNext();
  };

  return (
    <div>
      <motion.button
        onClick={handlePrevClick}
        className="absolute top-1/2 left-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className={`flex items-center ${styles.scale}`}>
          <ChevronLeft size={30} className="-mr-4" />
          <ChevronLeft size={50} />
        </div>
      </motion.button>
      {children}
      <motion.button
        onClick={handleNextClick}
        className="absolute top-1/2 right-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className={`flex items-center ${styles.scale}`}>
          <ChevronRight size={50} />
          <ChevronRight size={30} className="-ml-4" />
        </div>
      </motion.button>
    </div>
  );
}
