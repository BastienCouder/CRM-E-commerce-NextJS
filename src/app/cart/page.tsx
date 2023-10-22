import { getCart } from "@/lib/db/cart";
import formatPrice from "@/lib/format";
import { VAT_RATE } from "@/lib/utils";
import CartEntry from "./CartEntry";
import buttonStyles from "@/styles/Button.module.css";

export const metadata = {
  title: "Your Cart - E-commerce",
};

export default async function Cart() {
  const cart = await getCart();

  const total: number = parseInt(formatPrice(cart?.subtotal || 0, "EUR"));
  const totalTVA = (VAT_RATE * total).toFixed(2);

  const quantity = cart?.cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <>
      <div className="border-b-2 border-zinc-800 h-24 flex justify-center items-center 2xl:mx-20">
        Logo
      </div>
      <div className="mt-8 pb-10 lg:px-16 xl:px-44 ">
        <h1 className="text-4xl text-center lg:text-start">Panier</h1>
        <ul className="flex flex-col space-y-2 py-8 lg:py-12">
          {cart?.cartItems.map((cartItem) => {
            console.log(cartItem);

            return (
              <li
                key={cartItem.id}
                className="space-y-6 lg:space-y-0 flex flex-col px-8 py-4 lg:border-b-2 lg:border-zinc-800 w-full lg:flex-row items-center"
              >
                <CartEntry cartItem={cartItem} key={cartItem.id} />

                <div className="flex lg:hidden  h-[2px] w-3/4 bg-zinc-800"></div>
              </li>
            );
          })}
          {!cart?.cartItems.length && <p>Cart is empty</p>}
        </ul>

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
              <p className="capitalize">livraison</p>
              <p className="text-sm text-zinc-500">3 - 5 jours ouvrables</p>
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
      </div>
    </>
  );
}
