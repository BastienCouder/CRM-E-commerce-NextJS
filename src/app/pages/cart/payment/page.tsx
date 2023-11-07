import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createOrderIncrementation, handleStripePayment } from "./action";
import { getCart } from "@/lib/db/cart";
import { getDelivery } from "@/lib/db/delivery";
import Payment from "./Payment";
import { redirect } from "next/navigation";
import Image from "next/image";
import formatPrice, { formatDescription } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

export default async function Delivery() {
  const session = getServerSession(authOptions);
  const cart = await getCart();
  const delivery = await getDelivery();

  if (!session) {
    redirect("/auth");
  }

  let deliveryItem = null;
  if (delivery) {
    deliveryItem = delivery.deliveryItems.find((item) => item.Default);
  }

  return (
    <>
      {cart && delivery && (
        <div className="px-12 lg:px-0 space-y-4 pt-4">
          <h1 className="text-4xl text-center md:text-start">Récapitulatif</h1>
          <Separator className="bg-primary" />
          <section className="space-y-8">
            <article>
              <h2 className="text-2xl">
                {cart.cartItems.length > 1 ? "Produits" : "Produit"}
              </h2>
              <ul className="mt-8 flex flex flex-col justify-center md:justify-start md:flex-row flex-wrap gap-8 md:gap-24 w-full">
                {cart.cartItems.map((cartItem) => {
                  const description = `${cartItem.product.description}`;
                  const formattedDescription = formatDescription(description);
                  return (
                    <li key={cartItem.id} className="md:w-1/4 space-y-2">
                      <div className="flex w-full">
                        {cartItem.variant ? (
                          <Image
                            src={cartItem.variant.imageUrl || ""}
                            alt={cartItem.product.name}
                            width={400}
                            height={400}
                            className="rounded-lg w-[70px] h-[70px] object-contain"
                          />
                        ) : (
                          <Image
                            src={cartItem.product.imageUrl}
                            alt={cartItem.product.name}
                            width={400}
                            height={400}
                            className="rounded-lg w-[70px] h-[70px] object-contain"
                          />
                        )}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <p className="font-bold flex Item-center gap-2">
                          {cartItem.product.name}

                          {cartItem.variant && (
                            <>
                              <span>-</span>
                              <span className="text-sm">
                                {cartItem.variant.name}
                              </span>
                            </>
                          )}
                        </p>
                        <p className="w-full text-sm">{formattedDescription}</p>
                        <p className="uppercase">
                          {formatPrice(
                            cartItem.variant?.price
                              ? cartItem.variant?.price
                              : cartItem.product.price,
                            "EUR"
                          )}
                        </p>
                        <p className="capitalize flex gap-2">
                          {cartItem.quantity > 1 ? `quantités` : `quantité`}
                          <span>{cartItem.quantity}</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </article>
            <Separator className="bg-primary" />
            <article className="space-y-2">
              <h2 className="text-2xl">Adresse de livraison</h2>
              <div className="text-sm border-b-2 pb-8 border-primary">
                {deliveryItem && (
                  <>
                    <div className="font-bold capitalize flex space-x-2">
                      <p>{deliveryItem.name}</p>
                      <p>{deliveryItem.surname}</p>
                    </div>
                    <p className="uppercase">{deliveryItem.address}</p>
                    <div className="flex">
                      <p className="flex gap-2">
                        <span className="uppercase">
                          {deliveryItem.city},{deliveryItem.postcode},
                        </span>
                        {deliveryItem.country}
                      </p>
                    </div>
                    <p>{deliveryItem.tel}</p>
                  </>
                )}
              </div>
            </article>
          </section>
          <div className="pt-4">
            <Payment
              cartId={cart.id}
              deliveryId={delivery.id}
              handleStripePayment={handleStripePayment}
              createOrderIncrementation={createOrderIncrementation}
            />
          </div>
        </div>
      )}
    </>
  );
}
