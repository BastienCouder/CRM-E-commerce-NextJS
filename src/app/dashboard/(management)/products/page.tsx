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

async function getfetchProducts() {
  try {
    const data = await getProducts();
    if (Array.isArray(data)) {
      return z.array(ProductSchema).parse(data);
    } else {
      console.error("Erreur: Les données ne sont pas un tableau.");
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getfetchProducts();

  return (
    <>
      <section className="p-4 rounded-lg bg-card">
        <DataTable data={products} columns={columns} variant="products" />
      </section>
    </>
  );
}
