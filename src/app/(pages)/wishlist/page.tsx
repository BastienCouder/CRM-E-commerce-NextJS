import { getWishlist } from "@/lib/db/wishlist";
import WishlistEntry from "@/components/wishlist/wishlist-entry";
import { getDictionary } from "@/app/lang/dictionaries";
import { Metadata } from "next";
import website from "@/data/infosWebsite";
import { WishlistItem } from "@/schemas/DbSchema";
import { AddToCart } from "./actions";

export async function generateMetadata({
  params: { lang },
}: WishlistProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.favories_title} - ${website.name}`,
    description: `${dict.metadata.favories_metadescription}`,
  };
}

interface WishlistProps {
  params: {
    lang: string;
  };
}

export default async function Wishlist({ params: { lang } }: WishlistProps) {
  const dict = await getDictionary(lang);
  const wishlist = await getWishlist();

  return (
    <>
      <h1 className="text-3xl md:text-4xl text-center lg:text-start">
        {dict.favories.favories}
      </h1>

      <ul className="flex flex-col space-y-2 py-8 lg:py-12">
        {wishlist?.wishlistItems?.map((wishlistItem: WishlistItem) => {
          return (
            <li
              key={wishlistItem.id}
              className="space-y-6 lg:space-y-0 flex flex-col px-8 py-4 lg:border-b-2 lg:border-primary w-full lg:flex-row items-center"
            >
              <WishlistEntry
                wishlistItem={wishlistItem}
                key={wishlistItem.id}
                AddToCart={AddToCart}
                dict={dict}
              />
              <div className="flex lg:hidden  h-[2px] w-3/4 bg-primary"></div>
            </li>
          );
        })}
        {!wishlist?.wishlistItems?.length && (
          <p className="flex justify-center lg:justify-start items-center gap-x-16">
            {dict.favories.empty_favories}
          </p>
        )}
      </ul>
    </>
  );
}
