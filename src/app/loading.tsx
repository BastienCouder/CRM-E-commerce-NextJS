"use client";
import styles from "@/styles/Utils.module.css";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-primary text-white">
      <Image
        src={"/svg/logo.svg"}
        alt="logo"
        height={200}
        width={200}
        className={`${styles.opacity} mt-4 h-[180px] aspect-square object-contain`}
      ></Image>
    </div>
  );
}
