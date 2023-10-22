import PriceTag from "@/components/PriceTag";
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { cache } from "react";

const getProducts = cache(async () => {
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  if (!products) notFound();
  return products;
});

export const metadata = {
  title: "Products - E-commerce",
};

export default async function ProductPage() {
  const products = await getProducts();

  const productsByLetter: any = {};

  // Group products by the first letter of their names
  products.forEach((product) => {
    const firstLetter = product.name[0].toUpperCase();
    if (!productsByLetter[firstLetter]) {
      productsByLetter[firstLetter] = [];
    }
    productsByLetter[firstLetter].push(product);
  });

  return (
    <div className="flex">
      <div className="overflow-y-auto h-full">
        <table className="table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category ? product.category.name : ""}</td>
                  <td>{product.description}</td>
                  <td>
                    <PriceTag price={product.price} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="absolute top-20 right-0 overflow-x-auto h-96">
        <table className="table table-pin-rows">
          {Object.keys(productsByLetter).map((letter) => (
            <div key={letter}>
              <thead>
                <tr>
                  <th>{letter}</th>
                </tr>
              </thead>
              {productsByLetter[letter].map((product: any) => (
                <tr key={product.id}>
                  <td className="cursor-pointer">{product.name}</td>
                </tr>
              ))}
            </div>
          ))}
        </table>
      </div>
    </div>
  );
}
