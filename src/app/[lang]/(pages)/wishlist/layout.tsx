import MainLayout from "@/components/layouts/MainLayout";

export default async function WishlistLayout({
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
