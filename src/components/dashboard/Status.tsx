"use client";
import { Product, Order } from "@prisma/client";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSubTrigger } from "@radix-ui/react-dropdown-menu";
import { statuses as productStatuses } from "@/app/[lang]/dashboard/management/products/data/data";
import { statuses as orderStatuses } from "@/app/[lang]/dashboard/management/orders/data/data";

interface StatusProps {
  itemId: string;
  itemStatus: string | null;
  UpdateStatus: (itemId: string, newStatus: string) => Promise<Product | Order>;
  type: string;
  data: string;
}

export default function Status({
  type,
  UpdateStatus,
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
                {statuses
                  .filter((status) => status.value !== "delete")
                  .map((status: any) => (
                    <DropdownMenuRadioItem
                      key={status.value}
                      value={status.value}
                      className="cursor-pointer"
                      onClick={async () => {
                        await UpdateStatus(itemId, status.value);
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
