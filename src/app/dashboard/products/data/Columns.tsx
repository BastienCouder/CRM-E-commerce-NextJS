"use client";
import { ColumnDef } from "@tanstack/react-table";

import { statusesProducts, priorities } from "./data";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../../components/tables/DataTableColumnHeader";

import formatPrice from "@/lib/format";
import Image from "next/image";
import { DataTableRowActions } from "../../components/tables/DataTableRowActions";

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
            className="rounded-lg w-[50px] h-[50px] object-contain border-white/50 border-[1px]"
            src={imageUrl}
            alt={row.getValue("nom")}
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
      return (
        <div className="flex space-x-2 items-center">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.name}
          </span>
        </div>
      );
    },
    enableSorting: true,
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
    enableSorting: true,
  },
  {
    accessorKey: "price",
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
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const statusValue = row.original.status;

      const status = statusesProducts.find(
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
    enableSorting: true,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Privilège" />
    ),
    cell: ({ row }) => {
      console.log(row.original.priority);
      return (
        <div className="flex space-x-2">
          {row.original.priority.map((priorityValue: string) => {
            const priority = priorities.find(
              (priorityItem) => priorityItem.value === priorityValue
            );

            return (
              <Badge
                key={priority?.value}
                variant="outline"
                className={`${
                  priority?.value === "favorie"
                    ? "border-amber-700"
                    : priority?.value === "best seller"
                    ? "border-blue-700"
                    : "border-violet-700"
                }`}
              >
                {priority?.label}
              </Badge>
            );
          })}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);
      console.log(value, row, id);
      if (Array.isArray(rowValue)) {
        return value.some((val: string) => rowValue.includes(val));
      }
      return false;
    },
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} variant="products" />,
  },
];
