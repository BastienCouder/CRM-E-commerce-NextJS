import { Metadata } from "next";
import { columns } from "./data/Columns";
import { z } from "zod";
import { getProducts } from "@/lib/db/product";
import { DataTable } from "@/components/tables/DataTable";
import { ProductSchema } from "@/schemas/db-schema";

export const metadata: Metadata = {
  title: "Dashboard - Products",
  description: "Example dashboard app built using the components.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <section className="p-4 rounded-lg bg-card">
        <DataTable
          data={products as any}
          columns={columns}
          variant="products"
        />
      </section>
    </>
  );
}
