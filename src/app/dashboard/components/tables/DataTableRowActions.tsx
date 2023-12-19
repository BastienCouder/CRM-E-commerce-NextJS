import { Row } from "@tanstack/react-table";
import { orderSchema, productSchema } from "../../lib/zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import Status from "../Status";
import SoftDelete from "../SoftDelete";
import Favories from "../Favorites";
import Duplicate from "../Duplicate";
import { Button } from "@/components/ui/button";
import { FoldHorizontalIcon } from "lucide-react";
import {
  useServerDuplicateProduct,
  useServerUpdateProductFavourites,
} from "../../products/[id]/action";
import { useServerSoftDelete, useServerUpdateStatus } from "../../actions";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  variant: "orders" | "products";
}

export function DataTableRowActions<TData>({
  row,
  variant,
}: DataTableRowActionsProps<TData>) {
  let item: any = variant;

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
          <Link
            href={`/dashboard/${variant === "orders" ? "orders" : "products"}/${
              item.id
            }`}
          >
            {variant === "orders" ? "Voir le détail" : "Modifier"}
          </Link>
        </DropdownMenuItem>
        {item.deleteAt === null && (
          <>
            {variant === "products" && (
              <>
                <DropdownMenuItem>
                  <Duplicate
                    productId={item.id}
                    DuplicateProduct={useServerDuplicateProduct}
                    type="actions"
                  />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Favories
                    productId={item.id}
                    Favorite={useServerUpdateProductFavourites}
                    type="actions"
                    productPriority={item.priority}
                  />
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <Status
              itemId={item.id}
              UpdateStatus={useServerUpdateStatus}
              type="actions"
              data={variant}
              itemStatus={item.status}
            />
            <DropdownMenuSeparator />
            <SoftDelete
              itemId={item.id}
              SoftDelete={useServerSoftDelete}
              type="actions"
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
