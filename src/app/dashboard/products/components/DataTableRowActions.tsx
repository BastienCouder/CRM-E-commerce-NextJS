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
import { productSchema } from "../../lib/zod";
import SoftDelete from "../../components/SoftDelete";
import Link from "next/link";
import {
  useServerDuplicateProduct,
  useServerUpdateProductFavourites,
} from "../[id]/action";
import Favories from "../../components/Favorites";
import Duplicate from "../../components/Duplicate";
import { useServerSoftDelete, useServerUpdateStatus } from "../../actions";
import Status from "../../components/Status";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const product = productSchema.parse(row.original);

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
        <DropdownMenuItem>
          {" "}
          <Duplicate
            productId={product.id}
            DuplicateProduct={useServerDuplicateProduct}
            type="actions"
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Favories
            productId={product.id}
            FavoriteProduct={useServerUpdateProductFavourites}
            type="actions"
            productPriority={product.priority}
          />{" "}
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
