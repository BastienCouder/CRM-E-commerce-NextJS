"use client";

import { FoldHorizontalIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  useServerDuplicateProduct,
  useServerUpdateProductFavourites,
} from "../[id]/action";
import Duplicate from "@/components/dashboard/Duplicate";
import Favorites from "@/components/dashboard/Favorites";
import Status from "@/components/dashboard/Status";
import {
  useServerSoftDelete,
  useServerUpdateStatus,
} from "@/app/dashboard/actions";
import { ProductSchema } from "@/lib/DbSchema";
import SoftDelete from "@/components/dashboard/SoftDelete";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const product = ProductSchema.parse(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <FoldHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>
          <Link href={`/dashboard/products/${product.id}`}>Modifier</Link>
        </DropdownMenuItem>
        {product.deleteAt === null && (
          <>
            <DropdownMenuItem>
              <Duplicate
                productId={product.id}
                DuplicateProduct={useServerDuplicateProduct}
                type="actions"
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Favorites
                productId={product.id}
                Favorite={useServerUpdateProductFavourites}
                type="actions"
                productPriority={product.priority}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Status
              itemId={product.id}
              UpdateStatus={useServerUpdateStatus}
              type="actions"
              data="products"
              itemStatus={product.status}
            />
            <DropdownMenuSeparator />
            <SoftDelete
              itemId={product.id}
              SoftDelete={useServerSoftDelete}
              type="actions"
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
