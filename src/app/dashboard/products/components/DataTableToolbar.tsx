"use client";
import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { priorities, statuses } from "../data/data";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Plus, X } from "lucide-react";
import SoftDelete from "../../components/SoftDelete";
import { useServerSoftDelete } from "../../actions";

interface DataTableToolbarProps<TData> {
  table: Table<any>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSelected = Object.keys(table.getState().rowSelection).length > 0;
  const allRows = table.getRowModel().rows;

  const selectedRows = allRows.filter(
    (row) => table.getState().rowSelection[row.id]
  );
  const selectedRowIds = selectedRows.map((row) => row.original.id);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Produits..."
          value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nom")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("privilège") && (
          <DataTableFacetedFilter
            column={table.getColumn("privilège")}
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
          <>
            <SoftDelete
              itemId={selectedRowIds}
              SoftDelete={useServerSoftDelete}
              type="toolbar"
            />
          </>
        )}
        <Button
          variant="outline"
          size="xl"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Creer un produit
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
