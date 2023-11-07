import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Collection E-commerce",
  description: "Ceci est la collection de mon application.",
};

export default async function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b-2 border-primary h-24 flex justify-center items-center 2xl:mx-20">
        <Link href={"/"}>
          <Image
            src={"/svg/logo.svg"}
            alt="logo"
            height={200}
            width={200}
            className="mt-4 h-[180px] aspect-square object-contain"
          ></Image>
        </Link>
      </div>
      <div>{children}</div>
    </>
  );
}
