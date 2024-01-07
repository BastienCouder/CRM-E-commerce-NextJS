import { ProductProps, getProducts } from "./lib/db/product";
import { env } from "./lib/env";

const URL = `${env.NEXTAUTH_URL}`;

export default async function sitemap() {
  try {
    const products: ProductProps[] | null = await getProducts();

    if (!products) {
      throw new Error("Failed to fetch products");
    }

    const productUrls = products.map(({ id, createdAt }) => ({
      url: `${URL}/products/${id}`,
      lastModified: createdAt,
    }));

    const routes = [
      "",
      "/wishlist",
      "/shop",
      "/profile",
      "/cart",
      "/cart/delivery",
      "/cart/payment",
      "policy",
    ].map((route) => ({
      url: `${URL}${route}`,
      lastModified: new Date().toISOString(),
    }));

    return [...routes, ...productUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
