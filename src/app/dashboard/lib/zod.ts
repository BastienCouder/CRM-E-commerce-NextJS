import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  label: z.string().nullable(),
  stock: z.number().nullable(),
  status: z.string().nullable(),
  price: z.number(),
  priority: z.array(z.string()).nullable(),
});

export type Product = z.infer<typeof productSchema>;

export const orderSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  status: z.string().nullable(),
  orderNumber: z.string(),
  deleteAt: z.nullable(z.date()),

  cart: z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    }),
    cartItems: z.array(
      z.object({
        id: z.string(),
        variant: z
          .object({
            id: z.string(),
            name: z.string().nullable(),
            price: z.number().nullable(),
            imageUrl: z.string().nullable(),
          })
          .nullable(),
        product: z.object({
          id: z.string(),
          description: z.string(),
          imageUrl: z.string(),
          name: z.string(),
          status: z.string().nullable(),
          label: z.string().nullable(),
          priority: z.string().nullable(),
          price: z.number(),
          stock: z.number().nullable(),
          deleteAt: z.date().nullable(),
          createdAt: z.date(),
        }),
        quantity: z.number(),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
    ),
  }),

  deliveryItems: z.object({
    id: z.string(),
    deliveryId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),

    name: z.string(),
    surname: z.string(),
    email: z.string(),
    tel: z.string(),
    address: z.string(),
    postcode: z.string(),
    country: z.string(),
    city: z.string(),
    // deliveryOption: z.nullable(z.object({})),
  }),
  subtotal: z.number(),
});

export type Order = z.infer<typeof orderSchema>;
