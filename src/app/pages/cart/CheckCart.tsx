"use client";
import formatPrice from "@/lib/format";
import { VAT_RATE } from "@/lib/utils";
import { CartItems } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMemo } from "react";

interface CheckCartProps {
  cart: Cart | null;
}

interface Cart {
  subtotal: number;
  size: number;
  cartItems: CartItems[];
}

export default function CheckCart({ cart }: CheckCartProps) {
  const router = useRouter();

  const total: number = useMemo(() => {
    return parseInt(formatPrice(cart?.subtotal || 0, "EUR"));
  }, [cart?.subtotal]);

  const totalTVA: string = useMemo(() => {
    return (VAT_RATE * total).toFixed(2);
  }, [total]);

  const quantity: number | undefined = useMemo(() => {
    return cart?.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart?.cartItems]);

  const cartCheckout = () => {
    if (cart && cart.size !== 0) {
      router.push("/cart/delivery");
    } else {
      toast.error("Aucun article dans le panier");
    }
  };

  return (
    <section className="flex gap-y-8 lg:space-x-12 flex-col-reverse lg:flex-row items-center lg:items-start">
      <div className="text-sm lg:text-base tracking-wide space-y-4 bg-zinc-800 flex flex-col p-4 w-80">
        <h2 className="text-3xl mb-4">Récapitulatif</h2>
        <div className="flex justify-between">
          <div className="flex items-center space-x-3">
            <p className="capitalize">sous total</p>
            <p className="text-sm text-zinc-500">( {quantity} articles )</p>
          </div>
          <p className="sm text-zinc-500">
            {formatPrice(cart?.subtotal || 0, "EUR")}
          </p>
        </div>
        <div className="bg-zinc-500 w-full h-px"></div>
        <div className="flex space-x-4 items-center">
          <p className="capitalize">Expédition</p>
          <p className="text-sm text-zinc-500">Gratuite</p>
        </div>
        <div className="bg-zinc-500 w-full h-px"></div>
        <div className="flex justify-between">
          <div className="flex items-end space-x-2">
            <p className="capitalize font-bold">total</p>
            <p className="text-xs mb-[2px] text-zinc-500">
              ({totalTVA} € de <span className="font-bold">TVA</span>)
            </p>
          </div>
          <p>Total: {formatPrice(cart?.subtotal || 0, "EUR")}</p>
        </div>
        <div className="pt-4">
          <Button onClick={cartCheckout}>Valider</Button>
        </div>
      </div>
      {/* <div className="">
   <h2 className="capitalize text-2xl">code promo</h2>
   <Input
     id="promo"
     type="text"
     placeholder="saisir un code promo"
     name="promo"
   />
 </div> */}
    </section>
  );
}
