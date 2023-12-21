"use client";
import { ColumnDef } from "@tanstack/react-table";

import { newsletters } from "./data";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { DataTableRowActions } from "../components/DataTableRowActions";

import Image from "next/image";
import { DataTableColumnHeader } from "@/components/tables/DataTableColumnHeader";

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
      <DataTableColumnHeader column={column} title="Utilisateurs" />
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
      return (
        <div className="min-w-[120px] flex space-x-2">
          <Image
            className="rounded-full w-[35px] h-[35px] object-contain border-white border-[1px]"
            src={row.original.image}
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
    accessorKey: "nom",
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 items-center">
          <span className="max-w-[500px] lowercase truncate flex font-medium">
            {row.original.email}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "newsletter",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Newsletter" />
    ),
    cell: ({ row }) => {
      const newsletterValue = row.original.newsletter;
      const newsletter = newsletters.find(
        (newsletterItem) => newsletterItem.value === newsletterValue
      );

      return (
        <div className="flex space-x-2 items-center">
          <span className="max-w-[500px] lowercase truncate flex font-medium">
            <Badge
              variant="outline"
              className={`${
                newsletter?.value === true
                  ? "border-green-800"
                  : "border-destructive"
              }`}
            >
              {newsletter?.label}
            </Badge>
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
