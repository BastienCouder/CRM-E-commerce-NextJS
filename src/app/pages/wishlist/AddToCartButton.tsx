"use client";
import buttonStyles from "@/styles/Button.module.css";
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
        <button
          className={`py-3 px-5 relative uppercase tracking-[4px] flex items-center ${buttonStyles.button}`}
          onClick={() => {
            startTransition(async () => {
              await addToCart(productId, variantId);
              toast("Produit ajouté au panier");
            });
          }}
        >
          <div className={buttonStyles.buttonLeft}></div>
          <div className={buttonStyles.buttonTopLeft}></div>
          <div className={buttonStyles.buttonBottomLeft}></div>
          <div className={buttonStyles.buttonRight}></div>
          <div className={buttonStyles.buttonTopRight}></div>
          <div className={buttonStyles.buttonBottomRight}></div>
          Ajouter au panier
        </button>
      </div>

      <Toaster expand={false} position="bottom-left" />
    </>
  );
}
