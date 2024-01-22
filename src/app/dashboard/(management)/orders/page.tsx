import { Metadata } from "next";

import { columns } from "./data/Columns";
import { getOrderItems } from "@/lib/db/orderItem";
import { DataTable } from "@/components/tables/DataTable";

export const metadata: Metadata = {
  title: "Dashboard - Products",
  description: "Example dashboard app built using the components.",
};

export default async function ProductsPage() {
  const orders = await getOrderItems();

  return (
    <>
      <section className="p-4 rounded-lg bg-card">
        <DataTable data={orders!} columns={columns} variant="orders" />
      </section>
    </>
  );
}
