import { z } from "zod";

export const UserRoleEnum = z.enum(["ADMIN", "USER"]);
export const ColorEnum = z.enum(["or", "argent", "rose"]);
export const CategoryEnum = z.enum(["bracelet_cuir", "bracelet_acier"]);

export type Category = z.infer<typeof CategoryEnum>;
export type Color = z.infer<typeof ColorEnum>;
export type UserRole = z.infer<typeof UserRoleEnum>;

export const UserSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string().optional(),
    email: z.string().optional(),
    emailVerified: z.date().optional(),
    role: UserRoleEnum,
    newsletter: z.boolean().optional(),
    image: z.string().optional(),
    createdAt: z.date(),
    deleteAt: z.date().optional(),
  })
);

export const ProductVariantSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    imageUrl: z.string().nullable(),
    createdAt: z.date(),
    deleteAt: z.date().nullable(),
  })
);

export const ProductSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    description: z.string(),
    imageUrl: z.string(),
    name: z.string(),
    status: z.string(),
    priority: z.array(z.string()),
    price: z.number(),
    stock: z.number().nullable(),
    deleteAt: z.date().nullable(),
    createdAt: z.date(),
    variants: z.array(ProductVariantSchema),
    color: ColorEnum,
    category: CategoryEnum,
  })
);

export const CartSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    imageUrl: z.string().optional(),
    createdAt: z.date(),
    deleteAt: z.date().optional(),
  })
);

export type User = z.infer<typeof UserSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type Cart = z.infer<typeof CartSchema>;
