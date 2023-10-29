"use client";
import SubmitButton from "@/components/SubmitButton";
import { useTransition } from "react";
import { Toaster, toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  variantId: string;
  incrementProductQuantity: (
    productId: string,
    variantId: string
  ) => Promise<void>;
}

export default function AddToCartButton({
  productId,
  variantId,
  incrementProductQuantity,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <SubmitButton
        onClick={() => {
          startTransition(async () => {
            await incrementProductQuantity(productId, variantId);
            toast.success("Produit ajouté avec succès");
          });
        }}
      >
        Ajouter au panier
      </SubmitButton>

      <Toaster expand={false} position="bottom-left" />
    </>
  );
}
