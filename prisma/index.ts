const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // const user = await prisma.user.findUnique({
  //   where: {
  //     id: "651947a5b9f3a78b824f3326",
  //   },
  // });
  // Créer un produit
  // const category = await prisma.category.create({
  //   data: {
  //     name: "Catégorie 3",
  //   },
  // });
  // console.log(category);
  // const productOrder = await prisma.cart.create({
  //   data: {
  //     productId: product.id,
  //     quantity: 1,
  //   },
  // });
  // console.log(productOrder);
}

// const deliveryOptions = [
//   {
//     name: "Livraison Standard",
//     description: "Livraison en 3-5 jours ouvrables",
//     price: "2.99€",
//   },
//   {
//     name: "Livraison Express",
//     description: "Livraison en 1-2 jours ouvrables",
//     price: "7.99€",
//   },
// ];

//   async function seedDeliveryOptions() {
//     for (const option of deliveryOptions) {
//       await prisma.deliveryOptions.create({
//         data: {
//           name: option.name,
//           description: option.description,
//           price: option.price,
//         },
//       });
//     }
//   }
//   seedDeliveryOptions();
// }
main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
