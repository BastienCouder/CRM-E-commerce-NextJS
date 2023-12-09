import { Category } from "@prisma/client";

export function findCategoryIdByName(
  categoryName: string,
  categories: Category[]
): string | undefined {
  const category = categories.find((c) => c.name === categoryName);
  return category?.id;
}

export const calculateSubtotal = (order: any) => {
  return (
    order.cart?.cartItems.reduce((acc: number, item: any) => {
      const variantPrice = item.variant ? item.variant.price : null;
      const productPrice = item.product ? item.product.price : null;
      const price =
        variantPrice !== null
          ? variantPrice
          : productPrice !== null
          ? productPrice
          : 0;

      return acc + item.quantity * price;
    }, 0) || 0
  );
};
