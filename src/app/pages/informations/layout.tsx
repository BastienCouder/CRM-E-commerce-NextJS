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
      <div className="border-b-2 border-zinc-800 h-24 flex justify-center items-center 2xl:mx-20">
        Logo
      </div>
      <div className="mt-8 pb-10 lg:px-16 xl:px-44">{children}</div>
    </>
  );
}
