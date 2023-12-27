import { Table } from "@tanstack/react-table";
import SoftDelete from "@/components/dashboard/SoftDelete";
import { statuses as orderStatuses } from "@/app/dashboard/management/orders/data/data";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/tables/DataTableFacetedFilter";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { DataTableViewOptions } from "@/components/tables/DataTableViewOptions";
import {
  priorities,
  statuses as productStatuses,
} from "@/app/dashboard/management/products/data/data";
import { softDeleteItem } from "@/app/dashboard/management/actions";
import { ProductProps } from "@/lib/db/product";
import { OrderProps } from "@/lib/db/orderItem";
import { UserProps } from "@/lib/db/user";

interface DataTableToolbarProps {
  table: Table<ProductProps | OrderProps | UserProps>;
  variant: "orders" | "products" | "users";
}

export function DataTableToolbar({ table, variant }: DataTableToolbarProps) {
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
          value={
            variant === "products" || variant === "users"
              ? (table.getColumn("name")?.getFilterValue() as string)
              : (table.getColumn("email")?.getFilterValue() as string) ?? ""
          }
          onChange={(event: any) => {
            if (variant === "products" || variant === "users") {
              table.getColumn("name")?.setFilterValue(event.target.value);
            } else {
              table.getColumn("email")?.setFilterValue(event.target.value);
            }
          }}
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
            SoftDelete={softDeleteItem}
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
