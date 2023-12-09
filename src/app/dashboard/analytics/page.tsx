import { Metadata } from "next";
import CartWishlistChart from "./Components/CartWishlistChart";
import { useServerReadAnalyticsCartWishlist } from "./action";

export const metadata: Metadata = {
  title: "Dashboard -Analytics",
  description: "Example dashboard app built using the components.",
};

export default async function AnalyticsPage() {
  const analyticsData = await useServerReadAnalyticsCartWishlist();
  return (
    <>
      <div className="w-1/2 py-4 pr-2 border-2 border-muted rounded-lg">
        <h2 className="px-10 pb-2">Panier et Favories</h2>
        <CartWishlistChart analyticsData={analyticsData} />
      </div>
    </>
  );
}
