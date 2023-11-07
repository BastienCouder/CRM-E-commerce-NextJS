import Image from "next/image";

export const metadata = {
  title: "Information E-commerce",
  description: "",
};

export default async function InformationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b-2 border-primary h-24 flex justify-center items-center 2xl:mx-20">
        <Image
          src={"/svg/logo.svg"}
          alt="logo"
          height={200}
          width={200}
          className="mt-4 h-[180px] aspect-square object-contain"
        ></Image>
      </div>
      <div className="mt-8 pb-10 lg:px-16 xl:px-44">{children}</div>
    </>
  );
}
