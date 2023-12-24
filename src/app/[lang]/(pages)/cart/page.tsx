import { getCart } from "@/lib/db/cart";
import CartEntry from "@/components/CartEntry";
import CheckCart from "@/components/CheckCart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Loading from "@/app/[lang]/loading";
import { getDictionary } from "@/app/[lang]/dictionaries/dictionaries";
import { Metadata } from "next";
import urls from "@/lib/data/url";
import website from "@/lib/data/infosWebsite";

export async function generateMetadata({
  params: { lang },
}: CartProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.cart_title} - ${website.name}`,
    description: `${dict.metadata.cart_metadescritpion}`,
  };
}
interface CartProps {
  params: {
    lang: string;
  };
}

export default async function Cart({ params: { lang } }: CartProps) {
  const dict = await getDictionary(lang);
  const cart = await getCart();

  if (!cart) {
    <Loading />;
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl text-center lg:text-start">
            {dict.cart.shopping_cart}
          </h1>
          <ul className="flex flex-col space-y-2 py-4">
            {cart?.cartItems?.map((cartItem) => (
              <li
                key={cartItem.id}
                className="space-y-6 lg:space-y-0 flex flex-col px-8 py-4 lg:border-b-2 lg:border-primary w-full lg:flex-row items-center"
              >
                <CartEntry cartItem={cartItem} key={cartItem.id} dict={dict} />
                <div className="flex lg:hidden h-[2px] w-3/4 bg-primary"></div>
              </li>
            ))}
          </ul>
          {!cart?.cartItems?.length && (
            <>
              <div className="flex flex-col lg:flex-row gap-y-4 items-center gap-x-16">
                <p>{dict.cart.empty_cart}</p>
                <Link href={urls.store}>
                  <Button aria-label={dict.actions.back_to_store} size="xl">
                    {dict.cart.continue_shopping}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
        <CheckCart cart={cart} dict={dict} />
      </div>
    </>
  );
}
