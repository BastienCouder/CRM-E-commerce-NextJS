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
      <div className="border-b-2 border-zinc-800 h-24 flex justify-center items-center 2xl:mx-20">
        Logo
      </div>
      <div>{children}</div>
    </>
  );
}
