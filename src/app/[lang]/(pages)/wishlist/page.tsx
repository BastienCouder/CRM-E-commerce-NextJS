import { getWishlist } from "@/lib/db/wishlist";
import WishlistEntry from "./WishlistEntry";
import { useServerAddToCart } from "./actions";

export const metadata = {
  title: "Favories - E-commerce",
};

export default async function Wishlist() {
  const wishlist = await getWishlist();

  return (
    <>
      <div className="mt-8 pb-10 lg:px-16 xl:px-44 ">
        <h1 className="text-4xl text-center lg:text-start">Favories</h1>

        <ul className="flex flex-col space-y-2 py-8 lg:py-12">
          {wishlist?.wishlistItems.map((wishlistItem) => {
            return (
              <li
                key={wishlistItem.id}
                className="space-y-6 lg:space-y-0 flex flex-col px-8 py-4 lg:border-b-2 lg:border-primary w-full lg:flex-row items-center"
              >
                <WishlistEntry
                  wishlistItem={wishlistItem}
                  key={wishlistItem.id}
                  AddToCart={useServerAddToCart}
                />

                <div className="flex lg:hidden  h-[2px] w-3/4 bg-primary"></div>
              </li>
            );
          })}
          {!wishlist?.wishlistItems.length && <p>Vos favories sont vides</p>}
        </ul>
      </div>
    </>
  );
}
