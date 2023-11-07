"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Newsletter from "@/components/Newsletter";
import styles from "@/styles/Utils.module.css";

export default function Home() {
  const [scrollCount, setScrollCount] = useState(0);
  const router = useRouter();

  const handleScroll = (event: any) => {
    if (event.deltaY > 0) {
      setScrollCount(scrollCount + 1);
    } else {
      setScrollCount(Math.max(0, scrollCount - 1));
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [scrollCount]);

  useEffect(() => {
    if (scrollCount >= 6) {
      router.push("/collection");
    }
  }, [scrollCount, router]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        style={{ height: "100vh", overflow: "scroll" }}
        className="flex w-screen relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div>
          <div className={`w-[20rem] lg:w-[40rem] ${styles.scale}`}>
            <Image
              src={"/images/watch-2.jpg"}
              alt=""
              width={1000}
              height={1000}
            ></Image>
          </div>
          <div
            className={`absolute top-72 left-64 w-[20rem] lg:w-[30rem] ${styles.scale}`}
          >
            <Image
              src={"/images/watch3-2.jpg"}
              alt=""
              width={1000}
              height={1000}
            ></Image>
          </div>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="z-20 mt-12 md:text-7xl h-0 -ml-32"
        >
          Titre du site web
        </motion.h1>
        <Newsletter />

        <div
          className="hidden lg:block cursor-pointer"
          onClick={() => router.push("/collection")}
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
            initial={{ opacity: 0, y: 40, x: 60 }}
            animate={{ opacity: 1, y: 0, x: 60 }}
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
