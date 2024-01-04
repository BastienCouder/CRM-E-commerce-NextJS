import { z } from "zod";

export const UserRoleEnum = z.enum(["ADMIN", "USER", "MARKETING_MANAGER"]);

export const ColorEnum = z.enum(["or", "argent", "rose"]);
export const CategoryEnum = z.enum(["bracelet_cuir", "bracelet_acier"]);
export const DeviceEnum = z.enum(["desktop", "mobile"]);
export const BrowserEnum = z.enum([
  "Chrome",
  "Edge",
  "Safari",
  "Opera",
  "Firefox",
  "IE",
  "Other",
]);

// Type dérivé de l'énumération
export type Browser = z.infer<typeof BrowserEnum>;
export type Category = z.infer<typeof CategoryEnum>;
export type Color = z.infer<typeof ColorEnum>;
export type UserRole = z.infer<typeof UserRoleEnum>;
export type Device = z.infer<typeof DeviceEnum>;

export const UserSchema: z.ZodSchema<any> = z.lazy(() =>
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

export const ProductSchema: z.ZodSchema<any> = z.lazy(() =>
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
    color: ColorEnum,
    category: CategoryEnum,
  })
);

export const CartSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    userId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),
    subtotal: z.number().optional(),
    size: z.number().optional(),
    cartItems: z.array(CartItemSchema).optional(),
    orderItems: z.array(OrderItemSchema).optional(),
  })
);

export const CartItemSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    productId: z.string(),
    quantity: z.number(),
    cartId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),
    cart: CartSchema.optional(),
    product: ProductSchema.optional(),
  })
);

export const WishlistSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    userId: z.string().nullable(),
    size: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),

    wishlistItems: z.array(WishlistItemSchema).optional(),
  })
);

export const WishlistItemSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    productId: z.string(),
    wishlistId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),
    product: ProductSchema.optional(),
  })
);

export const DeliverySchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),
    deliveryItems: z.array(DeliveryItemSchema).optional(),
  })
);

export const DeliveryItemSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    deliveryId: z.string(),
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

export const DeliveryOptionSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    orderItems: z.array(OrderItemSchema).optional(),
    deleteAt: z.date().nullable(),
  })
);

export const OrderSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    userId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deleteAt: z.date().nullable(),
    orderItems: z.array(OrderItemSchema).optional(),
  })
);

export const OrderItemSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    orderNumber: z.string(),
    orderId: z.string(),
    cartId: z.string(),
    status: z.string(),
    subtotal: z.number().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deliveryItemsId: z.string().nullable(),
    deliveryOptionId: z.string().nullable(),
    deliveryItems: DeliveryItemSchema.optional(),
    order: OrderSchema.optional(),
    cart: CartSchema.optional(),
    deleteAt: z.date().nullable(),
  })
);

export const VisitorInfoSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    visitorId: z.string(),
    browser: BrowserEnum,
    os: z.string(),
    city: z.string().nullable(),
    country: z.string().nullable(),
    region: z.string().nullable(),
    deviceType: DeviceEnum,
    createdAt: z.date(),
    deleteAt: z.date().nullable(),
  })
);

// Types inférés
export type User = z.infer<typeof UserSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Wishlist = z.infer<typeof WishlistSchema>;
export type WishlistItem = z.infer<typeof WishlistItemSchema>;
export type Delivery = z.infer<typeof DeliverySchema>;
export type DeliveryItem = z.infer<typeof DeliveryItemSchema>;
export type DeliveryOption = z.infer<typeof DeliveryOptionSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type VisitorInfo = z.infer<typeof VisitorInfoSchema>;
