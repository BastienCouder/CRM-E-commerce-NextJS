// import { env } from "@/lib/env";

// interface UserAnalytics {
//   date: Date;
// }

// export interface UseServerReadAnalyticsWishlistCartOrderProps {
//   data: UserAnalytics[];
// }

// export async function useServerReadAnalyticsWishlistCartOrder(): Promise<UseServerReadAnalyticsWishlistCartOrderProps> {
//   try {
//     const endDate = new Date();
//     const siteCreationDate = new Date(env.CREATE_WEBSITE || "");
//     const startDate = siteCreationDate < endDate ? siteCreationDate : endDate;

//     const users = await prisma.user.findMany({
//       where: {
//         createdAt: {
//           gte: startDate,
//           lt: endDate,
//         },
//       },
//     });

//     return {
//       data: analyticsData,
//     };
//   } catch (error: any) {
//     throw new Error(
//       "Erreur lors de la récupération des données pour les produits : " +
//         error.message
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
