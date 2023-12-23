import { Metadata } from "next";
import { columns } from "./data/Columns";

import { z } from "zod";
import { getUsers } from "@/lib/db/user";
import { UserSchema } from "@/lib/DbSchema";
import { DataTable } from "@/components/tables/DataTable";
// import { useServerNewPriorityToRecentProducts } from "./action";

export const metadata: Metadata = {
  title: "Dashboard - Products",
  description: "Example dashboard app built using the components.",
};

async function getfetchUsers() {
  try {
    const data = await getUsers();
    if (Array.isArray(data)) {
      return z.array(UserSchema).parse(data);
    } else {
      console.error("Erreur: Les données ne sont pas un tableau.");
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return [];
  }
}

export default async function UserPage() {
  const users = await getfetchUsers();
  // await useServerNewPriorityToRecentProducts();

  return (
    <>
      <DataTable data={users as any} columns={columns} variant="users" />
    </>
  );
}
