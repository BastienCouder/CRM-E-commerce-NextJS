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
import Duplicate from "@/components/dashboard/duplicate";
import Favorites from "@/components/dashboard/favorites";
import Status from "@/components/dashboard/status";
import { ProductSchema } from "@/schemas/db-schema";
import SoftDelete from "@/components/dashboard/soft-delete";
import { updateStatusItem } from "@/app/dashboard/(management)/action/update-status";
import { softDeleteItem } from "@/app/dashboard/(management)/action/soft-delete";
import { updateProductFavourites } from "@/app/dashboard/(management)/action/update-product-favorites";
import { duplicateProduct } from "@/app/dashboard/(management)/action/duplicate-product";

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
          <Link href={`/dashboard/management/products/${product.id}`}>
            Modifier
          </Link>
        </DropdownMenuItem>
        {product.deleteAt === null && (
          <>
            <DropdownMenuItem>
              <Duplicate
                productId={product.id}
                DuplicateProduct={duplicateProduct}
                type="actions"
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Favorites
                productId={product.id}
                Favorite={updateProductFavourites}
                type="actions"
                productPriority={product.priority}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Status
              itemId={product.id}
              UpdateStatus={updateStatusItem}
              type="actions"
              data="products"
              itemStatus={product.status}
            />
            <DropdownMenuSeparator />
            <SoftDelete
              itemId={product.id}
              SoftDelete={softDeleteItem}
              type="actions"
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
