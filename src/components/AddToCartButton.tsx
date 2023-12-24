"use client";
import { Dictionary } from "@/app/[lang]/dictionaries/dictionaries";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Toaster, toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  variantId: string;
  addToCart: (productId: string, variantId: string) => Promise<void>;
  dict: Dictionary;
}

export default function AddToCartButton({
  productId,
  variantId,
  addToCart,
  dict,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        aria-label={dict.actions.add_to_cart}
        size="xl"
        onClick={() => {
          startTransition(async () => {
            await addToCart(productId, variantId);
            toast.success(`${dict.favories.succes_product}`);
          });
        }}
      >
        {dict.actions.add_to_cart}
      </Button>

      <Toaster expand={false} position="bottom-left" />
    </>
  );
}
