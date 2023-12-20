import {
  checkEmail,
  checkIfEmailExists,
  checkPassword,
} from "@/app/auth/action";
import * as z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  emailVerified: z.date().nullable(),
  account: z.string().nullable(),
  newsletter: z.boolean().nullable(),
  image: z.string().nullable(),
  language: z.string().nullable(),
  birthDate: z.string().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  deleteAt: z.date().nullable(),
});

//Register
export const RegisterSchema = z.object({
  username: z
    .string({
      required_error: "Le nom d'utilisateur est requis",
      invalid_type_error:
        "Le nom d'utilisateur doit être une chaîne de caractères",
    })
    .min(3, {
      message: "Le nom d'utilisateur doit comporter au moins 3 caractères",
    })
    .max(50),
  email: z
    .string({
      required_error: "L'adresse e-mail est requise",
      invalid_type_error: "L'adresse e-mail doit être une chaîne de caractères",
    })
    .max(250)
    .email({
      message: "Adresse e-mail invalide",
    })
    .refine(
      async (email) => {
        const existingUser = await checkIfEmailExists(email);
        return !existingUser;
      },
      {
        message: "L'e-mail est déjà utilisé",
      }
    ),
  password: z
    .string({
      required_error: "Le mot de passe est requis",
      invalid_type_error: "Le mot de passe doit être une chaîne de caractères",
    })
    .min(8, {
      message: "Le mot de passe doit comporter au moins 8 caractères.",
    }),
});

//Login
export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "L'adresse e-mail est requise",
      invalid_type_error: "L'adresse e-mail doit être une chaîne de caractères",
    })
    .max(250)
    .email({
      message: "Adresse e-mail invalide",
    })
    .refine(
      async (email) => {
        const errorEmail = await checkEmail({ email });
        return errorEmail;
      },
      {
        message: "Adresse e-mail incorrecte",
      }
    ),
  password: z
    .string({
      required_error: "Le mot de passe est requis",
      invalid_type_error: "Le mot de passe doit être une chaîne de caractères",
    })
    .min(8, {
      message: "Le mot de passe doit comporter au moins 8 caractères.",
    })
    .max(32, "Le mot de passe doit comporter moins de 32 caractères"),
});

//Account
export const AccountFormSchema = z.object({
  surname: z
    .string({
      required_error: "Le nom est requis",
      invalid_type_error: "Le nom doit être une chaîne de caractères",
    })
    .min(2, {
      message: "Le nom d'utilisateur doit comporter au moins 3 caractères",
    }),
  email: z
    .string({
      required_error: "L'adresse e-mail est requise",
      invalid_type_error: "L'adresse e-mail doit être une chaîne de caractères",
    })
    .max(250)
    .email({
      message: "Adresse e-mail invalide",
    }),
  // .refine(async (email) => {
  //   const isMatchingSession = await isEmailMatchingSession({ email });

  //   if (isMatchingSession) {
  //     return true;
  //   }

  //   const existingUser = await checkIfEmailExists({ email });
  //   return !existingUser;
  // }),
});

//Delivery
export const DeliverySchema = z.object({
  name: z
    .string({
      required_error: "Le nom est requis",
      invalid_type_error: "Le nom doit être une chaîne de caractères",
    })
    .min(2, {
      message: "Le nom doit comporter au moins 2 caractères.",
    })
    .max(50),
  surname: z
    .string({
      required_error: "Le prénom est requis",
      invalid_type_error: "Le prénom doit être une chaîne de caractères",
    })
    .min(2, {
      message: "Le prénom doit comporter au moins 2 caractères.",
    })
    .max(50),
  email: z
    .string({
      required_error: "L'e-mail est requis",
      invalid_type_error: "L'e-mail doit être une chaîne de caractères",
    })
    .min(2)
    .max(250)
    .email({
      message: "E-mail invalide",
    }),
  address: z
    .string({
      required_error: "L'adresse est requise",
      invalid_type_error: "L'adresse doit être une chaîne de caractères",
    })
    .min(2)
    .max(250),
  postcode: z
    .string({
      required_error: "Le code postal est requis",
      invalid_type_error: "Le code postal doit être une chaîne de caractères",
    })
    .min(2)
    .max(20),
  city: z
    .string({
      required_error: "La ville est requise",
      invalid_type_error: "La ville doit être une chaîne de caractères",
    })
    .min(2)
    .max(50),
  country: z
    .string({
      required_error: "Le pays est requis",
      invalid_type_error: "Le pays doit être une chaîne de caractères",
    })
    .min(2)
    .max(50),
  tel: z
    .string({
      required_error: "Le numéro de téléphone est requis",
      invalid_type_error:
        "Le numéro de téléphone doit être une chaîne de caractères",
    })
    .min(2)
    .max(20),
});

export type RegisterValues = z.infer<typeof RegisterSchema>;
export type LoginValues = z.infer<typeof LoginSchema>;
export type AccountFormValues = z.infer<typeof AccountFormSchema>;

export type DeliveryValues = z.infer<typeof DeliverySchema>;

export const defaultRegisterValues: Partial<RegisterValues> = {};
export const defaultLoginValues: Partial<LoginValues> = {};
export const defaultAccountValues: Partial<AccountFormValues> = {};
export const defaultDeliveryValues: Partial<DeliveryValues> = {};

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
