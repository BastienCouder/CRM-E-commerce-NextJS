import { Metadata } from "next";
import { columns } from "./components/Columns";
import { DataTable } from "./components/DataTable";
import { getProducts } from "../lib/db/product";
import { productSchema } from "../lib/zod";
import { z } from "zod";
import { useServerReadAnalyticsProducts } from "./action";
import AnalyticsOrder from "./AnalyticsProducts";

export const metadata: Metadata = {
  title: "Dashboard - Products",
  description: "Example dashboard app built using the components.",
};

async function getfetchProducts() {
  try {
    const data = await getProducts();
    if (Array.isArray(data)) {
      return z.array(productSchema).parse(data);
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
      <DataTable data={products as any} columns={columns} />
    </>
  );
}
