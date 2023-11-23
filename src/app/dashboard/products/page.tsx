import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";

import { z } from "zod";
import { taskSchema } from "./lib/zod";
import { columns } from "./components/Columns";
import { DataTable } from "./components/DataTable";
import { tasks } from "./data/task";

export const metadata: Metadata = {
  title: "Dashboard - Products",
  description: "Example dashboard app built using the components.",
};

async function getTasks() {
  return z.array(taskSchema).parse(tasks);
}

export default async function ProductsPage() {
  const tasks = await getTasks();
  return (
    <>
      Products
      <DataTable data={tasks} columns={columns} />
    </>
  );
}
