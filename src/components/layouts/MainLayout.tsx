"use client";

import Image from "next/image";
import Link from "next/link";

export default function MainLayout() {
  return (
    <>
      <div className="border-b-2 border-primary h-20 md:h-24 flex justify-center items-center 2xl:mx-20">
        <Link href={"/"}>
          <Image
            src={"/svg/logo.svg"}
            alt="logo"
            height={200}
            width={200}
            className="mt-4 h-[140px] md:h-[180px] aspect-square object-contain"
          />
        </Link>
      </div>
    </>
  );
}
