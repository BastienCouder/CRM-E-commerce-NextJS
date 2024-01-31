import { Metadata } from "next";
import { columns } from "./data/Columns";

import { z } from "zod";
import { getUsers } from "@/lib/db/user";
import { UserSchema } from "@/schemas/db-schema";
import { DataTable } from "@/components/tables/DataTable";
// import { useServerNewPriorityToRecentProducts } from "./action";

export const metadata: Metadata = {
  title: "Dashboard - Products",
  description: "Example dashboard app built using the components.",
};

export default async function UserPage() {
  const users = await getUsers();
  // await useServerNewPriorityToRecentProducts();

  return (
    <>
      <section className="p-4 rounded-lg bg-card">
        <DataTable data={users as any} columns={columns} variant="users" />
      </section>
    </>
  );
}
