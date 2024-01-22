// export async function useServerNewPriorityToRecentProducts() {
//   const oneMonthAgo = new Date();
//   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 2);

//   const allProducts = await prisma.product.findMany();

//   const updatePromises = allProducts.map((product: Product) => {
//     const wasCreatedLastMonth = product.createdAt! >= oneMonthAgo;
//     let newPriority;

//     if (wasCreatedLastMonth) {
//       newPriority = Array.from(new Set([...product?.priority, "new"]));
//     } else {
//       newPriority = product.priority.filter((p) => p !== "new");
//     }

//     return prisma.product.update({
//       where: { id: product.id },
//       data: { priority: { set: newPriority } },
//     });
//   });

//   await Promise.all(updatePromises);
// }
