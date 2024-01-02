"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Newsletter from "@/components/Newsletter";
import styles from "@/styles/keyframes.module.css";
import { sendSubscribeToNewsletter } from "@/lib/email/auth";
export default function Home() {
  const [scrollCount, setScrollCount] = useState(0);
  const router = useRouter();
  const handleScroll = useCallback(
    async (event: any) => {
      if (event.deltaY > 0) {
        setScrollCount(scrollCount + 1);
      } else {
        setScrollCount(Math.max(0, scrollCount - 1));
      }
    },
    [scrollCount]
  );

  const handleTouchStart = (e: any) => {
    let startY = e.touches[0].clientY;

    const handleTouchMove = (e: any) => {
      let deltaY = e.touches[0].clientY - startY;

      if (deltaY > 0) {
        setScrollCount(Math.max(0, scrollCount - 5));
      } else if (deltaY < 0) {
        setScrollCount(scrollCount + 5);
      }

      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [scrollCount, handleScroll]);

  useEffect(() => {
    if (scrollCount >= 6) {
      router.push("/store");
    }
  }, [scrollCount, router]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        onTouchStart={handleTouchStart}
        style={{ height: "100vh", overflow: "scroll" }}
        className="flex w-screen relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div>
          <div
            className={`absolute md:relative top-36 md:top-0 ${styles.scale}`}
          >
            <Image
              src={"/images/watch-2.jpg"}
              alt=""
              width={1000}
              height={1000}
              className="w-[15rem] md:w-[25rem] xl:w-[35rem]"
            ></Image>
          </div>
          <div
            className={`absolute top-52 left-32 md:top-52 md:left-64 xl:left-80 ${styles.scale}`}
          >
            <Image
              src={"/images/watch3-2.jpg"}
              alt=""
              width={1000}
              height={1000}
              className="w-[20rem] md:w-[25rem] xl:w-[30rem] "
            ></Image>
          </div>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="z-20 mt-10 ml-10 text-4xl w-2/3 md:mt-12 lg:text-7xl h-0 md:-ml-32"
        >
          Titre du site web
        </motion.h1>
        {/* <Newsletter SubscribeToNewsletter={sendSubscribeToNewsletter} /> */}

        <div
          className="block cursor-pointer"
          onClick={() => router.push("/store")}
        >
          {scrollCount >= 3 ? (
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: 180 }}
              animate={{ opacity: 1, y: 0, rotate: 180 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="fixed flex bottom-16 right-1/2"
            >
              <div className="h-8 w-8 p-2 border-2"></div>
              <div className="absolute right-3 bottom-3 w-[8px] h-[8px] bg-secondary"></div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: 180 }}
              animate={{ opacity: 1, y: 0, rotate: 180 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="fixed flex bottom-16 right-1/2"
            >
              <div
                style={{
                  transform: `scale(${1 - scrollCount / 5})`,
                  right: `${13 + scrollCount / 5}px`,
                }}
                className="absolute top-12 space-y-12"
              >
                <div className="absolute right-[3px] w-[2px] h-8 bg-white"></div>
                <div className="absolute right-[0] w-[8px] h-[8px] bg-secondary"></div>
              </div>
              <div className="h-8 w-8 p-2 border-2"></div>
            </motion.div>
          )}
          <motion.p
            initial={{ opacity: 0, y: 40, x: 70 }}
            animate={{ opacity: 1, y: 0, x: 70 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="uppercase fixed flex bottom-6 right-1/2"
          >
            Voir la collection
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
