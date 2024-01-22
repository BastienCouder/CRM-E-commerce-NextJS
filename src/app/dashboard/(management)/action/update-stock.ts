"use server";
export async function updateProductStock(
  productId: string,
  newStock: number
): Promise<void> {
  await prisma.product.update({
    where: { id: productId },
    data: { stock: newStock },
  });
}
