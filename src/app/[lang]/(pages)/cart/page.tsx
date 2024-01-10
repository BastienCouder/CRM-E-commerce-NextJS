import { getCart } from "@/lib/db/cart";
import CartEntry from "@/components/cart/cart-entry";
import CheckCart from "@/components/cart/check-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lang/dictionaries";
import { Metadata } from "next";
import routes from "@/lib/data/routes.json";
import website from "@/lib/data/infosWebsite";
import { CartItem } from "@/schemas/db-schema";

interface CartProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({
  params: { lang },
}: CartProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.cart_title} - ${website.name}`,
    description: `${dict.metadata.cart_metadescription}`,
  };
}

export default async function Cart({ params: { lang } }: CartProps) {
  const dict = await getDictionary(lang);
  const cart = await getCart();

  // Afficher un message si le panier est vide
  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl text-center lg:text-start">
          {dict.cart.shopping_cart}
        </h1>
        <div className="flex flex-col items-center justify-center lg:justify-start lg:items-start space-y-4">
          <p>{dict.cart.empty_cart}</p>
          <Link href={routes.shop} passHref>
            <Button variant={"client"} aria-label={dict.actions.back_to_store}>
              {dict.cart.continue_shopping}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Rendu pour un panier non vide
  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl text-center lg:text-start">
        {dict.cart.shopping_cart}
      </h1>
      <ul className="flex flex-col space-y-2 py-4">
        {cart.cartItems.map((cartItem: CartItem) => (
          <li
            key={cartItem.id}
            className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 px-8 py-4 lg:border-b-2 lg:border-primary w-full"
          >
            <CartEntry cartItem={cartItem} dict={dict} />
            <div className="flex lg:hidden h-[2px] w-3/4 bg-primary"></div>
          </li>
        ))}
      </ul>
      <CheckCart cart={cart} dict={dict} />
    </div>
  );
}
