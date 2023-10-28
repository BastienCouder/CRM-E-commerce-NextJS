"use client";
import formatPrice from "@/lib/format";
import { VAT_RATE } from "@/lib/utils";
import { CartItems } from "@prisma/client";
import buttonStyles from "@/styles/Button.module.css";
import { redirect, useRouter } from "next/navigation";

interface CheckProps {
  cart: Cart | null;
}

interface Cart {
  subtotal: number;
  size: number;
  cartItems: CartItems[];
}

export default function Check({ cart }: CheckProps) {
  const router = useRouter();
  const total: number = parseInt(formatPrice(cart?.subtotal || 0, "EUR"));
  const totalTVA = (VAT_RATE * total).toFixed(2);

  const quantity = cart?.cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const cartCheckout = () => {
    if (cart && cart.size !== 0) {
      router.push("/cart/delivery");
    } else {
      redirect("/cart");
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
          <p className="text-sm text-zinc-500">
            Les frais de livraison sont calculés lors du paiement
          </p>
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
          <button
            onClick={cartCheckout}
            className={`${buttonStyles.button} py-3 px-5 w-44 justify-center relative uppercase tracking-[4px] flex items-center`}
          >
            <div className={buttonStyles.buttonLeft}></div>
            <div className={buttonStyles.buttonTopLeft}></div>
            <div className={buttonStyles.buttonBottomLeft}></div>
            <div className={buttonStyles.buttonRight}></div>
            <div className={buttonStyles.buttonTopRight}></div>
            <div className={buttonStyles.buttonBottomRight}></div>
            Valider
          </button>
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
