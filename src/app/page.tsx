import ProductCard from "@/components/ProductCard";
import { prisma } from "../lib/db/prisma";

export default async function Home() {
  const products = await prisma.products.findMany({
    orderBy: {
      id: "desc",
    },
    include: { category: true },
  });

  return (
    <div>
      <div>
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
