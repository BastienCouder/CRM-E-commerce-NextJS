"use client";
import { Row } from "@tanstack/react-table";
import { orderSchema } from "../../lib/zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FoldHorizontalIcon } from "lucide-react";
import Link from "next/link";
import Statuses from "../../components/Statuses";
import { useServerUpdateProductStatus } from "../actions";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const order = orderSchema.parse(row.original);

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
          <Link href={`/dashboard/orders/${order.id}`}>Voir le détail</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {" "}
          {/* <Duplicate
            productId={product.id}
            DuplicateProduct={useServerDuplicateProduct}
            type="actions"
          /> */}
        </DropdownMenuItem>
        <DropdownMenuItem>
          {/* <Favories
            productId={product.id}
            FavoriteProduct={useServerUpdateProductFavourites}
            type="actions"
            productPriority={product.priority}
          />{" "} */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Statuses
          itemId={order.id}
          UpdateStatusItem={useServerUpdateProductStatus}
          type="actions"
          data="orders"
          itemStatus={order.status}
        />
        <DropdownMenuSeparator />

        {/* <SoftDelete
          productId={product.id}
          SoftDeleteProduct={useServerSoftDeleteProduct}
          type="actions"
        /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
