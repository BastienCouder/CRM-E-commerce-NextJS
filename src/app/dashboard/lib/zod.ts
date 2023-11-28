import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  label: z.string().nullable(),
  stock: z.number().nullable(),
  status: z.string().nullable(),
  price: z.number(),
  priority: z.string().nullable(),
});

export type Product = z.infer<typeof productSchema>;
