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
  //       role: "ADMIN",
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
  await prisma.product.create({
    data: {
      name: "Produit 1",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
      price: 9000,
      imageUrl: "/images/montre1.png",
      category: "bracelet_acier",
      color: "or",
      status: "unavailable",
      stock: 20,
      variants: {
        create: [
          {
            name: "or",
            price: 9000,
            imageUrl: "/images/montre1.png",
          },
          {
            name: "argent",
            price: 9000,
            imageUrl: "/images/variants/montre1-argent.png",
          },
          {
            name: "rose",
            price: 9000,
            imageUrl: "/images/variants/montre1-rose.png",
          },
        ],
      },
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
