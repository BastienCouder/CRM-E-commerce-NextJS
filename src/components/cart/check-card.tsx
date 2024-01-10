"use client";
import formatPrice from "../../lib/helpers/format";
import { VAT_RATE } from "@/lib/utils";
import { CartItems } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMemo } from "react";
import { Dictionary } from "@/lang/dictionaries";
import routes from "@/lib/data/routes.json";

interface CheckCartProps {
  cart: Cart;
  dict: Dictionary;
}

interface Cart {
  subtotal: number;
  size: number;
  cartItems: CartItems[];
}

export default function CheckCart({ cart, dict }: CheckCartProps) {
  const router = useRouter();

  const total: number = useMemo(() => {
    return parseInt(formatPrice(cart.subtotal || 0, dict.locale));
  }, [cart.subtotal, dict.locale]);

  const totalTVA: string = useMemo(() => {
    return (VAT_RATE * total).toFixed(2);
  }, [total]);

  const quantity: number | undefined = useMemo(() => {
    return cart.cartItems.reduce((acc, item) => acc + item?.quantity, 0);
  }, [cart.cartItems]);

  const cartCheckout = () => {
    if (cart.size !== 0) {
      router.push(`${routes.delivery}`);
    } else {
      toast.error(`${dict.cart.no_items_in_cart}`);
    }
  };

  return (
    <section className="flex gap-y-8 lg:space-x-12 flex-col-reverse lg:flex-row items-center lg:items-start">
      <div className="shadow-lg text-sm lg:text-base tracking-wide space-y-4 bg-card flex flex-col p-4 w-80">
        <h2 className="text-2xl mb-4">{dict.cart.recap}</h2>
        <div className="flex justify-between">
          <div className="flex items-center space-x-3">
            <p className="capitalize">{dict.cart.subtotal}</p>
            <p className="text-sm text-white space-x-1">
              ({quantity}{" "}
              {quantity! > 1 ? `${dict.cart.articles}` : `${dict.cart.article}`}
              )
            </p>
          </div>
          <p className="sm text-white">
            {formatPrice(cart.subtotal || 0, dict.locale)}
          </p>
        </div>
        <div className="bg-white w-full h-px"></div>
        <div className="flex space-x-4 items-center">
          <p className="capitalize">{dict.cart.shipping}</p>
          <p className="text-sm text-white">{dict.cart.free}</p>
        </div>
        <div className="bg-white w-full h-px"></div>
        <div className="flex justify-between">
          <div className="flex items-end space-x-2">
            <p className="capitalize font-bold">{dict.cart.total}</p>
            <p className="flex text-xs mb-[2px] text-white gap-x-1">
              ({totalTVA} {dict.pronouns.of}
              <span className="font-bold uppercase">{dict.cart.tva})</span>
            </p>
          </div>
          <p>{formatPrice(cart.subtotal || 0, dict.locale)}</p>
        </div>
        <div className="pt-4">
          <Button
            variant={"client"}
            aria-label={dict.actions.confirm}
            onClick={cartCheckout}
          >
            {dict.actions.confirm}
          </Button>
        </div>
      </div>
    </section>
  );
}
