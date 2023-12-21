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
    name: z.string().nullable(),
    email: z.string().nullable(),
    emailVerified: z.date().nullable(),
    role: UserRoleEnum,
    newsletter: z.boolean().nullable(),
    image: z.string().nullable(),
    createdAt: z.date(),
    deleteAt: z.date().nullable(),
    carts: z.array(CartSchema).optional(),
    wishlists: z.array(WishlistSchema).optional(),
    deliveries: z.array(DeliverySchema).optional(),
    orders: z.array(OrderSchema).optional(),
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
    imageUrl: z.string().nullable(),
    name: z.string(),
    status: z.string(),
    priority: z.array(z.string()),
    price: z.number(),
    stock: z.number().nullable(),
    deleteAt: z.date().nullable(),
    createdAt: z.date(),
    variants: z.array(ProductVariantSchema).nullable(),
    color: ColorEnum,
    category: CategoryEnum,
  })
);

export const CartSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    userId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),
    cartItems: z.array(CartItemSchema).optional(),
    orderItems: z.array(OrderItemSchema).optional(),
  })
);

export const CartItemSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    variantId: z.string().nullable(),
    productId: z.string(),
    quantity: z.number(),
    cartId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),
    product: ProductSchema.optional(),
    variant: ProductVariantSchema.optional(),
  })
);

export const WishlistSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    userId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),
    wishlistItems: z.array(WishlistItemSchema).optional(),
  })
);

export const WishlistItemSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    variantId: z.string().nullable(),
    productId: z.string(),
    wishlistId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),
  })
);

export const DeliverySchema = z.lazy(() =>
  z.object({
    id: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),
    deliveryItems: z.array(DeliveryItemSchema).optional(),
  })
);

export const DeliveryItemSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    deliveryId: z.string(),
    deliveryOptionId: z.string().nullable(),
    Default: z.boolean(),
    name: z.string(),
    surname: z.string(),
    email: z.string(),
    tel: z.string(),
    address: z.string(),
    postcode: z.string(),
    country: z.string(),
    city: z.string(),
    orderItems: z.array(OrderItemSchema).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),
  })
);

export const DeliveryOptionSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),
  })
);

export const OrderSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    userId: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    deleteAt: z.date().optional(),
    orderItems: z.array(OrderItemSchema).optional(),
  })
);

export const OrderItemSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    orderNumber: z.string(),
    orderId: z.string().optional(),
    cartId: z.string(),
    status: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    deliveryItemsId: z.string().optional(),
    deleteAt: z.date().optional(),
  })
);

// Types inférés
export type User = z.infer<typeof UserSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Wishlist = z.infer<typeof WishlistSchema>;
export type WishlistItem = z.infer<typeof WishlistItemSchema>;
export type Delivery = z.infer<typeof DeliverySchema>;
export type DeliveryItem = z.infer<typeof DeliveryItemSchema>;
export type DeliveryOption = z.infer<typeof DeliveryOptionSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
