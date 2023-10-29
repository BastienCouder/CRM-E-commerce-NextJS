"use client";
import SubmitButton from "@/components/SubmitButton";
import { useTransition } from "react";
import { Toaster, toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  variantId: string;
  addToCart: (productId: string, variantId: string) => Promise<void>;
}

export default function AddToCartButton({
  productId,
  variantId,
  addToCart,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <SubmitButton
          onClick={() => {
            startTransition(async () => {
              await addToCart(productId, variantId);
              toast("Produit ajouté au panier");
            });
          }}
        >
          Ajouter au panier
        </SubmitButton>
      </div>

      <Toaster expand={false} position="bottom-left" />
    </>
  );
}
