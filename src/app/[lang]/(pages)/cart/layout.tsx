import MainLayout from "@/components/layouts/MainLayout";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Cart E-commerce",
  description: "Ceci est le dashboard de mon application.",
};

export default async function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainLayout />
      <div className="mt-8 pb-10 lg:px-16 xl:px-44">{children}</div>
    </>
  );
}
