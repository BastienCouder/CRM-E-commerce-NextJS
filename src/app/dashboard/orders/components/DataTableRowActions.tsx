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
import Status from "../../components/Status";
import { useServerUpdateProductStatus } from "../actions";

import SoftDelete from "../../components/SoftDelete";
import { useServerSoftDelete } from "../../actions";

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
        <Status
          itemId={order.id}
          UpdateStatusItem={useServerUpdateProductStatus}
          type="actions"
          data="orders"
          itemStatus={order.status}
        />
        <DropdownMenuSeparator />

        <SoftDelete
          itemId={order.id}
          SoftDelete={useServerSoftDelete}
          type="actions"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
