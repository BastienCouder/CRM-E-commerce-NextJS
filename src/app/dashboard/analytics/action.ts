import { prisma } from "@/lib/db/prisma";
import { startOfWeek, format } from "date-fns";
import { revalidatePath } from "next/cache";

interface AnalyticsData {
  date: string;
  cartItems?: number;
  wishlistItems?: number;
  totalItems?: number; // Nouvelle propriété
}

export interface useServerReadAnalyticsCartWishlistProps {
  groupedData: AnalyticsData[];
  maxTotal: number;
}

export async function useServerReadAnalyticsCartWishlist(): Promise<useServerReadAnalyticsCartWishlistProps> {
  try {
    // Récupérer les paniers
    const carts = await prisma.cart.findMany({
      include: {
        cartItems: true,
      },
    });

    // Récupérer les listes de souhaits
    const wishlistItems = await prisma.wishlistItems.findMany({});

    // Transformer les données des paniers
    const cartData: AnalyticsData[] = carts.map((cart) => ({
      date: format(
        startOfWeek(new Date(cart.createdAt!), { weekStartsOn: 1 }),
        "yyyy-MM-dd"
      ),
      cartItems: cart.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    }));

    const wishlistData: AnalyticsData[] = wishlistItems.map((wishlist) => ({
      date: format(
        startOfWeek(new Date(wishlist.createdAt!), { weekStartsOn: 1 }),
        "yyyy-MM-dd"
      ),
      wishlistItems: 1,
    }));

    const combinedData: AnalyticsData[] = cartData.concat(wishlistData);
    const groupedData: AnalyticsData[] = combinedData.reduce<AnalyticsData[]>(
      (result, item) => {
        const existingItem = result.find((i) => i.date === item.date);

        if (existingItem) {
          existingItem.cartItems =
            (existingItem.cartItems || 0) + (item.cartItems || 0);
          existingItem.wishlistItems =
            (existingItem.wishlistItems || 0) + (item.wishlistItems || 0);
          existingItem.totalItems =
            (existingItem.totalItems || 0) +
            (item.cartItems || 0) +
            (item.wishlistItems || 0);
        } else {
          const newItem: AnalyticsData = {
            date: item.date,
            cartItems: item.cartItems || 0,
            wishlistItems: item.wishlistItems || 0,
            totalItems: (item.cartItems || 0) + (item.wishlistItems || 0),
          };
          result.push(newItem);
        }

        return result;
      },
      []
    );
    const maxTotal = Math.max(
      ...groupedData.map((item) => item.totalItems || 0)
    );

    revalidatePath(`/dashboard`);
    console.log(groupedData);
    console.log("Global Total:", maxTotal);
    return {
      groupedData,
      maxTotal,
    };
  } catch (error: any) {
    throw new Error(
      "Erreur lors de la récupération des données pour le graphique : " +
        error.message
    );
  } finally {
    await prisma.$disconnect();
  }
}
