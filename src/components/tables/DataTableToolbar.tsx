import { Table } from "@tanstack/react-table";

import SoftDelete from "../dashboard/SoftDelete";
import { useServerSoftDelete } from "../../app/dashboard/management/actions";
import { statuses as orderStatuses } from "../../app/dashboard/management/orders/data/data";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { DataTableViewOptions } from "./DataTableViewOptions";
import {
  priorities,
  statuses as productStatuses,
} from "../../app/dashboard/management/products/data/data";

interface DataTableToolbarProps<TData> {
  table: Table<any>;
  variant: "orders" | "products" | "users";
}

export function DataTableToolbar<TData>({
  table,
  variant,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSelected = Object.keys(table.getState().rowSelection).length > 0;
  const selectedRows = table
    .getRowModel()
    .rows.filter((row) => table.getState().rowSelection[row.id]);
  const selectedRowIds = selectedRows.map((row) => row.original.id);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={
            variant === "orders"
              ? "Commandes..."
              : variant === "products"
              ? "Produits..."
              : "Utilisateurs..."
          }
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event: any) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={variant === "orders" ? orderStatuses : productStatuses}
          />
        )}
        {variant === "products" && table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Privilège"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Réinitialiser
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        {isSelected && (
          <SoftDelete
            itemId={selectedRowIds}
            SoftDelete={useServerSoftDelete}
            type="toolbar"
          />
        )}
        {variant === "products" && (
          <Button
            variant="outline"
            size="xl"
            onClick={() => {}}
            className="h-8 px-2 lg:px-3"
          >
            Créer un produit
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
