import { getCart } from "@/lib/db/cart";
import { getDelivery } from "@/lib/db/delivery";
import { Separator } from "@/components/ui/separator";
import DeliveryDetails from "@/components/profile/delivery-details";
import { createOrderIncrementation, handleStripePayment } from "./action";
import AddToOrder from "@/components/actions/add-to-order";
import { Metadata } from "next";
import { getDictionary } from "@/app/lang/dictionaries";
import website from "@/data/infosWebsite";
import { cache } from "react";
import { notFound } from "next/navigation";
import { CartItem, DeliveryItem, DeliveryOption } from "@/schemas/DbSchema";
import CartItemsDetails from "@/components/profile/cartItems-details";

export async function generateMetadata({
  params: { lang },
}: PaymentProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.payment_title} - ${website.name}`,
    description: `${dict.metadata.payment_metadescritpion}`,
  };
}
interface PaymentProps {
  params: {
    lang: string;
  };
}

const getDeliveryOptions = cache(async () => {
  const deliveryOptions: DeliveryOption[] =
    await prisma.deliveryOption.findMany();
  if (!deliveryOptions) notFound();
  return deliveryOptions;
});

export default async function Payment({ params: { lang } }: PaymentProps) {
  const dict = await getDictionary(lang);
  const cart = await getCart();
  const delivery = await getDelivery();
  const deliveryOptions = await getDeliveryOptions();
  let deliveryItem = null;
  if (delivery) {
    deliveryItem = delivery.deliveryItems.find(
      (item: DeliveryItem) => item.Default
    );
  }

  return (
    <>
      <div className="space-y-4 mx-10 lg:mx-0">
        <h1 className="text-3xl md:text-4xl text-center md:text-start">
          {dict.payment.recap}
        </h1>
        <Separator className="bg-primary" />
        <section className="space-y-8">
          <article>
            <h2 className="text-2xl">
              {cart && cart?.cartItems?.length > 1
                ? `${dict.payment.products}`
                : `${dict.payment.product}`}
            </h2>
            <ul className="mt-8 flex flex flex-col justify-center md:justify-start md:flex-row flex-wrap gap-8 md:gap-24 w-full">
              {cart &&
                cart?.cartItems?.map((cartItem: CartItem) => (
                  <CartItemsDetails
                    key={cartItem.id}
                    cartItem={cartItem}
                    dict={dict}
                  />
                ))}
            </ul>
          </article>
          <Separator className="bg-primary" />
          <DeliveryDetails
            deliveryItem={deliveryItem!}
            dict={dict}
            deliveryOptions={deliveryOptions}
          />
        </section>
        <div className="pt-4">
          {cart && delivery && (
            <AddToOrder
              cartId={cart.id}
              deliveryId={delivery.id}
              deliveryOptions={deliveryOptions}
              handleStripePayment={handleStripePayment}
              createOrderIncrementation={createOrderIncrementation}
              dict={dict}
            />
          )}
        </div>
      </div>
    </>
  );
}
