"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [scrollCount, setScrollCount] = useState(0);
  const router = useRouter();

  const handleScroll = (event: any) => {
    if (event.deltaY > 0) {
      // Si le défilement est vers le bas, incrémentation du compteur de défilements
      setScrollCount(scrollCount + 1);
    } else {
      // Si le défilement est vers le haut, décrémentation du compteur de défilements
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
    // Détectez quand le compteur atteint 5 défilements et naviguez vers une autre page
    if (scrollCount >= 7) {
      router.push("/collection"); // Remplacez '/autre-page' par l'URL de la page de destination
    }
  }, [scrollCount, router]);
  console.log(scrollCount);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        style={{ height: "100vh", overflow: "scroll" }}
        className="flex w-screen relative"
        initial={{ opacity: 1 }}
      >
        <div>
          <div className="w-[20rem] lg:w-[40rem]">
            <Image
              src={"/images/watch-2.jpg"}
              alt=""
              width={1000}
              height={1000}
            ></Image>
          </div>
          <div className="absolute top-72 left-64 w-[20rem] lg:w-[30rem]">
            <Image
              src={"/images/watch3-2.jpg"}
              alt=""
              width={1000}
              height={1000}
            ></Image>
          </div>
        </div>
        <h1 className="mt-12 md:text-7xl -ml-32">
          Titre de l&apos;application
        </h1>

        <div
          className="hidden lg:block cursor-pointer"
          onClick={() => router.push("/collection")}
        >
          {scrollCount >= 3 ? (
            <div className="fixed flex bottom-16 right-1/2 rotate-180">
              <div className="h-8 w-8 p-2 border-2"></div>
              <div className="absolute right-3 bottom-3 w-[8px] h-[8px] bg-white"></div>
            </div>
          ) : (
            <div className="fixed flex bottom-16 right-1/2 rotate-180">
              <div
                style={{
                  transform: `scale(${1 - scrollCount / 5})`,
                  right: `${13 + scrollCount / 5}px`,
                }}
                className="absolute top-12 space-y-12"
              >
                <div className="absolute right-[3px] w-[2px] h-8 bg-white"></div>
                <div className="absolute right-[0] w-[8px] h-[8px] bg-white"></div>
              </div>
              <div className="h-8 w-8 p-2 border-2"></div>
            </div>
          )}
          <p className="uppercase fixed flex bottom-6 right-1/2 translate-x-16">
            Voir la collection
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
