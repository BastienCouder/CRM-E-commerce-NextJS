import { Metadata } from "next";

import { z } from "zod";

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
      <DataTable data={orders!} columns={columns} variant="orders" />
    </>
  );
}
