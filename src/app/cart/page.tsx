import { getCart } from "@/lib/db/cart";
import CartEntry from "./CartEntry";
import Check from "./Check";

export const metadata = {
  title: "Your Cart - E-commerce",
};

export default async function Cart() {
  const cart = await getCart();

  return (
    <>
      <div className="border-b-2 border-zinc-800 h-24 flex justify-center items-center 2xl:mx-20">
        Logo
      </div>
      <div className="mt-8 pb-10 lg:px-16 xl:px-44 ">
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
          {!cart?.cartItems.length && <p>Cart is empty</p>}
        </ul>

        <Check cart={cart} />
      </div>
    </>
  );
}
