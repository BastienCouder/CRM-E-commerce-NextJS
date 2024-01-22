import { getDelivery } from "@/lib/db/delivery";
import FormDelivery from "@/components/delivery/form-delivery";
import SelectDelivery from "@/components/delivery/select-delivery";
import { Metadata } from "next";
import { getDictionary } from "@/lang/dictionaries";
import website from "@/lib/data/infosWebsite";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata({
  params: { lang },
}: DeliveryProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.delivery_title} - ${website.name}`,
    description: `${dict.metadata.delivery_metadescription}`,
  };
}
interface DeliveryProps {
  params: {
    lang: string;
  };
}

const getDeliveryOptions = cache(async () => {
  const deliveryOptions = await prisma.deliveryOption.findMany();

  if (!deliveryOptions) notFound();
  return deliveryOptions;
});

export default async function Delivery({ params: { lang } }: DeliveryProps) {
  const session = await auth();
  const delivery = await getDelivery();
  const deliveryOptions = await getDeliveryOptions();
  const dict = await getDictionary(lang);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col space-y-8 mb-8">
          <div className="px-4 md:px-20 xl:p-0 space-y-8">
            <h1 className="text-4xl text-center md:text-start capitalize">
              {dict.delivery.delivery}
            </h1>
          </div>
          <SelectDelivery
            session={session}
            delivery={delivery}
            deliveryOptions={deliveryOptions}
            dict={dict}
          />
          <Separator />
        </div>
        <section className="w-2/3 space-y-4">
          <h2>Ajouter une adresse de livraison</h2>
          <FormDelivery />
        </section>
      </div>
    </>
  );
}
