const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // const userId = "656627b29828ecd93ff6ec7f";

  // const user = await prisma.user.findUnique({
  //   where: {
  //     id: userId,
  //   },
  // });
  // if (user) {
  //   // Mise à jour du champ "isAdmin" pour définir l'utilisateur comme administrateur
  //   const updatedUser = await prisma.user.update({
  //     where: {
  //       id: userId,
  //     },
  //     data: {
  //       role: "admin",
  //     },
  //   });
  //   console.log(`L'utilisateur  est maintenant administrateur.`);
  // } else {
  //   console.log("Utilisateur non trouvé.");
  // }
  // const category = await prisma.color.create({
  //   data: {
  //     name: "bronze",
  //   },
  // });
  // console.log(category);
  // const colorId = "6543ebe837fe0b8d20918e67";
  // const categoryId = "653aa6eef14338a1dca7ff19";
  // const productId = "6548fe48162c51153c648d0c";
  // const product = await prisma.product.update({
  //   where: {
  //     id: productId,
  //   },
  //   data: {
  //     category: {
  //       connect: {
  //         id: categoryId,
  //       },
  //     },
  //     color: {
  //       connect: {
  //         id: colorId,
  //       },
  //     },
  //   },
  // });
  await prisma.accountMail.create({
    data: {
      label: "Bastien Couder",
      email: "couderbastien@gmail.com",
    },
  });
}
//   });
//   const deliveryOptions = [
//     {
//       name: "Livraison Standard",
//       description: "Livraison en 3-5 jours ouvrables",
//       price: 299,
//     },
//     {
//       name: "Livraison Express",
//       description: "Livraison en 1-2 jours ouvrables",
//       price: 799,
//     },
//   ];
//   async function seedDeliveryOptions() {
//     for (const option of deliveryOptions) {
//       await prisma.deliveryOption.create({
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
