import MainLayout from "@/components/layouts/MainLayout";

export default async function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainLayout />
      <div>{children}</div>
    </>
  );
}
