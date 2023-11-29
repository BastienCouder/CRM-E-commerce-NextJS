"use client";
import { Product, Order } from "@prisma/client";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSubTrigger } from "@radix-ui/react-dropdown-menu";
import { statuses as productStatuses } from "../products/data/data";
import { statuses as orderStatuses } from "../orders/data/data";

interface StatusProps {
  itemId: string;
  itemStatus: string | null;
  data: string;
  UpdateStatusItem: (
    itemId: string,
    newStatus: string
  ) => Promise<Product | Order>;
  type: string;
}

export default function Status({
  type,
  UpdateStatusItem,
  itemId,
  itemStatus,
  data,
}: StatusProps) {
  const statuses = data === "products" ? productStatuses : orderStatuses;

  return (
    <>
      {type === "actions" && (
        <div className="flex w-full items-center px-2 text-sm">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:border-none hover:outline-none">
              Status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={itemStatus || undefined}>
                {statuses.map((status: any) => (
                  <DropdownMenuRadioItem
                    key={status.value}
                    value={status.value}
                    className="cursor-pointer"
                    onClick={async () => {
                      await UpdateStatusItem(itemId, status.value);
                    }}
                  >
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </div>
      )}

      {type === "settings" && ""}
    </>
  );
}
