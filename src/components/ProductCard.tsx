import Link from "next/link";
import PriceTag from "./PriceTag";
import Image from "next/image";

import { Products, Category } from "@prisma/client";

interface ProductCardProps {
  product: Products & {
    category: Category | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;
  return (
    <div>
      <Link
        href={"/products/" + product.id}
        className="card w-full bg-base-100 hover:shadow-xl transition-shadow"
      >
        <figure>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={800}
            height={400}
            className="h-48 object-cover"
          />
        </figure>
        <div>
          <h2>{product.name}</h2>
          {product.category && <h2>{product.category.name}</h2>}
          {isNew && <div className="badge badge-secondary">New</div>}
          <p>{product.description}</p>
          <PriceTag price={product.price} />
        </div>
      </Link>
    </div>
  );
}
