"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";

import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSubTrigger } from "@radix-ui/react-dropdown-menu";
import { labels } from "../products/data/data";

interface LabelProps {
  productId: string;
  productLabel: string | null;
  UpdateLabelProduct: (productId: string, newLabel: string) => Promise<Product>;
  type: string;
}

export default function Label({
  type,
  UpdateLabelProduct,
  productId,
  productLabel,
}: LabelProps) {
  return (
    <>
      {type === "actions" && (
        <div className="flex w-full items-center px-2 text-sm">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:border-none hover:outline-none">
              État
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={productLabel || undefined}>
                {labels.map((label: any) => (
                  <DropdownMenuRadioItem
                    key={label.value}
                    value={label.value}
                    onClick={async () => {
                      await UpdateLabelProduct(productId, label.value);
                    }}
                  >
                    {label.label}
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
