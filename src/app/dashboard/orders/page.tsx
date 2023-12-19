import { Metadata } from "next";

import { z } from "zod";
import { orderSchema } from "../lib/zod";
import { DataTable } from "../components/tables/DataTable";
import { columns } from "./data/Columns";
import { useServerReadAnalyticsOrders } from "./actions";
import AnalyticsOrder from "./AnalyticsOrder";

import { getOrderItems } from "../../../lib/db/orderItem";

export const metadata: Metadata = {
  title: "Dashboard - Products",
  description: "Example dashboard app built using the components.",
};

async function getfetchProducts() {
  try {
    const data = await getOrderItems();

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

  return (
    <>
      <AnalyticsOrder analyticsData={await useServerReadAnalyticsOrders()} />
      <DataTable data={orders} columns={columns} variant="orders" />
    </>
  );
}
