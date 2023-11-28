"use client";
import { ColumnDef } from "@tanstack/react-table";

import { statuses, priorities, labels } from "../data/data";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";

import formatPrice from "@/lib/format";
import Image from "next/image";

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "index",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Produits" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl;

      return (
        <div className="min-w-[120px] flex space-x-2">
          <Image
            className="rounded-lg w-[50px] h-[50px] object-contain border-white border-[1px]"
            src={row.original.imageUrl!}
            alt={row.getValue("name")}
            width={500}
            height={500}
          />
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => {
      const label = labels.find(
        (label: any) => label.value === row.original.label
      );

      return (
        <div className="flex space-x-2 items-center">
          {label && <Badge variant="outline">{label?.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const stock = row.original.stock;

      return (
        <div className="flex space-x-2">
          <span
            className={`max-w-[500px] truncate font-medium ${
              stock === 0 ? "text-red-500" : ""
            }`}
          >
            {stock ? stock : "Rupture de stock"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "prix",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prix" />
    ),
    cell: ({ row }) => {
      const price = row.original.price;
      const formattedPrice = formatPrice(price!, "EUR");

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formattedPrice}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const statusValue = row.original.status;
      const status = statuses.find(
        (statusItem) => statusItem.value === statusValue
      );

      return (
        <div className="flex space-x-2">
          {status && (
            <Badge
              variant="outline"
              className={`${
                status.value === "available"
                  ? "border-green-800"
                  : status.value === "unavailable"
                  ? "border-blue-800"
                  : "border-destructive"
              }`}
            >
              {status.label}
            </Badge>
          )}
        </div>
      );
    },

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "privilège",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Privilège" />
    ),
    cell: ({ row }) => {
      const priorityValue = row.original.priority;
      const priority = priorities.find(
        (priorityItem) => priorityItem.value === priorityValue
      );

      return (
        <div className="flex space-x-2">
          {priority && (
            <Badge
              variant="outline"
              className={`${
                priority.value === "favorites" ? "border-amber-700" : ""
              }`}
            >
              {priority.label}
            </Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
