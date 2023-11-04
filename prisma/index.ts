const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // const userId = "6533a2555cf192fe1e2cbe6a";
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
  //   console.log(
  //     `L'utilisateur ${updatedUser.username} est maintenant administrateur.`
  //   );
  // } else {
  //   console.log("Utilisateur non trouvé.");
  // }

  // const category = await prisma.color.create({
  //   data: {
  //     name: "rose",
  //   },
  // });
  // console.log(category);

  // const colorId = "6543ebf1bea5aaa901450acd";
  // const productId = "65429de57e957726166f5dca";
  // const product = await prisma.product.update({
  //   where: {
  //     id: productId,
  //   },
  //   data: {
  //     color: {
  //       connect: {
  //         id: colorId,
  //       },
  //     },
  //   },
  // });
  // console.log(product);

  const product = await prisma.product.create({
    data: {
      name: "Produit 5",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's .",
      price: 4000,
      imageUrl: "/images/montre1-rose.png",
      variants: {
        create: [
          {
            color: "or",
            imageUrl: "/images/montre1-or.png",
          },
          {
            color: "argent",
            price: 1800,
            imageUrl: "/images/variants/montre1-argent.png",
          },
          {
            color: "rose",
            price: 1800,
            imageUrl: "/images/variants/montre1-rose.png",
          },
        ],
      },
    },
  });

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
}
main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
