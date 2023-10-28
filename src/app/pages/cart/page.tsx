import { getCart } from "@/lib/db/cart";
import CartEntry from "./CartEntry";
import Check from "./Check";
import buttonStyles from "@/styles/Button.module.css";
import Link from "next/link";

export const metadata = {
  title: "Your Cart - E-commerce",
};

export default async function Cart() {
  const cart = await getCart();

  return (
    <>
      <h1 className="text-4xl text-center lg:text-start">Panier</h1>
      <ul className="flex flex-col space-y-2 py-8 lg:py-12">
        {cart?.cartItems.map((cartItem) => (
          <li
            key={cartItem.id}
            className="space-y-6 lg:space-y-0 flex flex-col px-8 py-4 lg:border-b-2 lg:border-zinc-800 w-full lg:flex-row items-center"
          >
            <CartEntry cartItem={cartItem} key={cartItem.id} />

            <div className="flex lg:hidden  h-[2px] w-3/4 bg-zinc-800"></div>
          </li>
        ))}
        {!cart?.cartItems.length && (
          <>
            <div className="flex items-center gap-x-16">
              <p>Votre panier est vide</p>
              <Link href="/">
                <button
                  className={`${buttonStyles.button} py-3 px-5 w-96 justify-center relative uppercase tracking-[4px] flex items-center`}
                >
                  <div className={buttonStyles.buttonLeft}></div>
                  <div className={buttonStyles.buttonTopLeft}></div>
                  <div className={buttonStyles.buttonBottomLeft}></div>
                  <div className={buttonStyles.buttonTop}></div>
                  <div className={buttonStyles.buttonBottom}></div>
                  <div className={buttonStyles.buttonRight}></div>
                  <div className={buttonStyles.buttonTopRight}></div>
                  <div className={buttonStyles.buttonBottomRight}></div>
                  Continuer mes achats
                </button>
              </Link>
            </div>
          </>
        )}
      </ul>

      <Check cart={cart} />
    </>
  );
}
