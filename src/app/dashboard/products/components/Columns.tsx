"use client";
import { ColumnDef } from "@tanstack/react-table";

import {
  names,
  images,
  prices,
  stocks,
  statuses,
  priorities,
} from "../data/data";

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
      const imageUrl = images.find(
        (image: any) => image.value === row.original.imageUrl
      );

      return (
        <div className="min-w-[120px] flex space-x-2">
          {imageUrl && <Badge variant="outline">{imageUrl.label}</Badge>}
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
    accessorKey: "nom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => {
      const name = names.find((name: any) => name.value === row.original.name);

      return (
        <div className="flex space-x-2">
          {name && <Badge variant="outline">{name.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.original.name}
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
      const stockValue = row.original.stock;
      const stock = stocks.find(
        (stockItem) => parseInt(stockItem.value) === stockValue
      );

      return (
        <div className="flex space-x-2">
          {stock && <Badge variant="outline">{stock.label}</Badge>}
          <span
            className={`max-w-[500px] truncate font-medium ${
              stockValue === 0 ? "text-red-500" : ""
            }`}
          >
            {stockValue ? stockValue : "Rupture de stock"}
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
      const priceValue = row.original.price;
      const formattedPrice = formatPrice(priceValue!, "EUR");

      const price = prices.find(
        (priceItem: any) => priceItem.value === row.original.price
      );

      return (
        <div className="flex space-x-2">
          {price && <Badge variant="outline">{price.label}</Badge>}
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
                  ? "bg-green-800"
                  : status.value === "unavailable"
                  ? "bg-blue-800"
                  : "bg-destructive"
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
                priority.value === "favorites" ? "bg-amber-700" : ""
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
