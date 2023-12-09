import { Metadata } from "next";
import { getOrders } from "../lib/db/orders";
import { z } from "zod";
import { orderSchema } from "../lib/zod";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/Columns";
import { useServerReadAnalyticsSale } from "./actions";
import SaleChart from "./components/SaleChart";

export const metadata: Metadata = {
  title: "Dashboard - Products",
  description: "Example dashboard app built using the components.",
};

async function getfetchProducts() {
  try {
    const data = await getOrders();

    if (Array.isArray(data)) {
      return z.array(orderSchema).parse(data);
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
  const orders = await getfetchProducts();
  const analyticsData = await useServerReadAnalyticsSale();
  return (
    <>
      <div className="w-1/2 border p-4 mb-4 rounded-lg">
        <SaleChart analyticsData={analyticsData} />
      </div>
      <DataTable data={orders} columns={columns} />
    </>
  );
}
