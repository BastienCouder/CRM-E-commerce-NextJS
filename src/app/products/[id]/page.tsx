import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { incrementProductQuantity, incrementWishlist } from "./actions";
import Product from "./Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getLike } from "@/lib/db/like";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: true },
  });

  if (!product) notFound();
  return product;
});

export async function generateMetadata({
  params: { id },
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(id);
  return {
    title: product.name + " - E-commerce",
    description: product.description,
    // openGraph: {
    //   images: [{ url: product.imageUrl }],
    // },
  };
}

export default async function ProductPage({
  params: { id },
}: ProductPageProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const product = await getProduct(id);

  const likedProductId = product?.variants[0]?.id || product.id;
  let likedVariant = null;
  if (product?.variants) {
    likedVariant = product.variants.find(
      (variant) => variant.id === likedProductId
    );
  }
  if (userId) {
    const like = await getLike(userId, likedProductId);
    console.log(like);

    return (
      <Product
        product={product}
        session={session}
        like={like}
        incrementProductQuantity={incrementProductQuantity}
        incrementWishlist={incrementWishlist}
      />
    );
  }
}
