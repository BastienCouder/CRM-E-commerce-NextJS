"use client";

import { FoldHorizontalIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { productSchema } from "../../lib/zod";
import { names } from "../data/data";
import SoftDelete from "../../components/SoftDelete";
import Link from "next/link";
import {
  useServerSoftDeleteProduct,
  useServerUpdateProductFavourites,
} from "../[id]/action";
import Favories from "../../components/Favorites";

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
        <DropdownMenuItem>Faire une copy</DropdownMenuItem>
        <DropdownMenuItem>
          <Favories
            productId={product.id}
            FavoriteProduct={useServerUpdateProductFavourites}
            type="actions"
            productPriority={product.priority}
          />{" "}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Noms</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={product.label || undefined}>
              {names.map((label: any) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <SoftDelete
          productId={product.id}
          SoftDeleteProduct={useServerSoftDeleteProduct}
          type="actions"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
