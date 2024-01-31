import { getWishlist } from "@/lib/db/wishlist";
import WishlistEntry from "@/components/wishlist/wishlist-entry";
import { getDictionary } from "@/lang/dictionaries";
import { Metadata } from "next";
import website from "@/lib/data/infosWebsite";
import { WishlistItem } from "@/schemas/db-schema";
import { addProductToCart } from "@/app/actions/pages/add-to-cart";

interface WishlistProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({
  params: { lang },
}: WishlistProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.favories_title} - ${website.name}`,
    description: `${dict.metadata.favories_metadescription}`,
  };
}

export default async function Wishlist({ params: { lang } }: WishlistProps) {
  const dict = await getDictionary(lang);
  const wishlist = await getWishlist();

  // Afficher un message si la liste de souhaits est vide
  if (!wishlist || wishlist.size === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl text-center lg:text-start">
          {dict.favories.favories}
        </h1>
        <div className="flex justify-center items-center lg:justify-start lg:items-start">
          <p>{dict.favories.empty_favories}</p>
        </div>
      </div>
    );
  }

  // Rendu pour une liste de souhaits non vide
  return (
    <>
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl text-center lg:text-start">
          {dict.favories.favories}
        </h1>
        <ul className="flex flex-col space-y-2 py-8 lg:py-12">
          {wishlist.wishlistItems &&
            wishlist.wishlistItems.map(
              (wishlistItem: WishlistItem, index: number) => {
                return (
                  <li
                    key={index}
                    className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 px-8 py-4 lg:border-b-2 lg:border-primary w-full"
                  >
                    <WishlistEntry
                      wishlistItem={wishlistItem}
                      AddToCart={addProductToCart}
                      dict={dict}
                    />
                    <div className="flex lg:hidden h-[2px] w-3/4 bg-primary"></div>
                  </li>
                );
              }
            )}
        </ul>
      </div>
    </>
  );
}
