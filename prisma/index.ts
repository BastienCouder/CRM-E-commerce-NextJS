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
  //     name: "bronze",
  //   },
  // });
  // console.log(category);
  const colorId = "6548fc162e085cb98f53e3a2";
  const categoryId = "6533e2ec992cbcd6500334bc";
  const productId = "6548fe48162c51153c648d0c";
  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      category: {
        connect: {
          id: categoryId,
        },
      },
      color: {
        connect: {
          id: colorId,
        },
      },
    },
  });
  console.log(product);
  // const product = await prisma.product.create({
  //   data: {
  //     name: "Produit 16",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
  //     price: 20000,
  //     imageUrl: "/images/montre16.png",
  //     variants: {
  //       create: [
  //         {
  //           color: "or",
  //           price: 20000,
  //           imageUrl: "/images/montre16.png",
  //         },
  //         {
  //           color: "bronze",
  //           price: 19000,
  //           imageUrl: "/images/variants/montre16-bronze.png",
  //         },
  //         // {
  //         //   color: "rose",
  //         //   price: 800,
  //         //   imageUrl: "/images/variants/montre1-rose.png",
  //         // },
  //       ],
  //     },
  //   },
  // });
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
