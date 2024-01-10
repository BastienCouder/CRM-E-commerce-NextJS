import { env } from "@/lib/env";
import { ProductProps } from "@/lib/db/product";
import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import routes from "@/lib/data/routes.json";
import { CategoriesProps } from "@/lib/db/category";

const locales = ["fr", "en"];

const URL = `${env.NEXTAUTH_URL}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products: ProductProps[] = await prisma.product.findMany();
  const productEntries: MetadataRoute.Sitemap = products.flatMap((product) =>
    locales.map((locale) => ({
      url: `${URL}/${locale}/products/${product.name}`,
      lastModified: new Date(product.updatedAt),
      // changeFrequency:,
      //priority:
    }))
  );

  const categories: CategoriesProps[] = await prisma.category.findMany();
  const categoryEntries: MetadataRoute.Sitemap = categories.flatMap(
    (category) =>
      locales.map((locale) => ({
        url: `${URL}/${locale}/${category.name}`,
        lastModified: new Date(category.updatedAt),
        // changeFrequency:,
        //priority:
      }))
  );

  const staticRoutes = [
    `${routes.home}`,
    `${routes.wishlist}`,
    `${routes.shop}`,
    `${routes.profile}`,
    `${routes.cart}`,
    `${routes.delivery}`,
    `${routes.payment}`,
  ];

  const statics = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${URL}/${locale}${route}`,
      lastModified: new Date().toISOString(),
    }))
  );
  return [...statics, ...productEntries, ...categoryEntries];
}
