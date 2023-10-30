"use client";
import { Button } from "@/components/ui/button";
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
      <Button
        size="xl"
        onClick={() => {
          startTransition(async () => {
            await addToCart(productId, variantId);
            toast.success("Produit ajouté avec succès");
          });
        }}
      >
        Ajouter au panier
      </Button>

      <Toaster expand={false} position="bottom-left" />
    </>
  );
}
