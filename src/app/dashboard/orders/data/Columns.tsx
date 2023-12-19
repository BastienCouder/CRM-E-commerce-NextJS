"use client";
import { ColumnDef } from "@tanstack/react-table";
import { statusesOrders } from "./data";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../../components/tables/DataTableColumnHeader";

import formatPrice, { formatDate } from "@/lib/format";
import { calculateSubtotal } from "../../lib/utils";
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
      <DataTableColumnHeader column={column} title="Commandes" />
    ),
    cell: ({ row }) => (
      <div className="w-[140px]">{row.original.orderNumber}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 items-center">
          <span className="max-w-[500px] capitalize truncate flex font-medium">
            {row.original.cart.user.name}
          </span>
        </div>
      );
    },
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
            {row.original.cart.user.email}
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
      const price = calculateSubtotal(row.original);

      const formattedPrice = formatPrice(price!, "EUR");

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formattedPrice}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const statusValue = row.original.status;
      const status = statusesOrders.find(
        (statusItem) => statusItem.value === statusValue
      );

      return (
        <div className="flex space-x-2">
          {status && (
            <Badge
              variant="outline"
              className={`${
                status.value === "delivered"
                  ? "border-green-800"
                  : status.value === "in progress"
                  ? "border-blue-800"
                  : status.value === "waiting"
                  ? "border-amber-700"
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
    accessorKey: "création",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Création" />
    ),
    cell: ({ row }) => {
      const dateValue = new Date(row.original.createdAt);
      const formattedDate = formatDate(dateValue);

      return (
        <div className="flex space-x-2">
          {formattedDate && (
            <span className="max-w-[500px] lowercase truncate flex font-medium">
              {formattedDate}
            </span>
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
    cell: ({ row }) => <DataTableRowActions row={row} variant="orders" />,
  },
];
