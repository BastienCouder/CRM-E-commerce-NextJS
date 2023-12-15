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
  deleteAt: z.nullable(z.date()),
});

export type Product = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  // other fields...
});

export const variantSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  price: z.number().optional(),
  imageUrl: z.string().optional(),
  // other fields...
});

export const cartItemSchema = z.object({
  // Define the schema for cart items
});

export const wishlistItemSchema = z.object({
  // Define the schema for wishlist items
});

const colorSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  // other fields...
});

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
          priority: z.array(z.string()),
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
