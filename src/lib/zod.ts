import {
  checkEmail,
  checkIfEmailExists,
  checkPassword,
} from "@/app/auth/action";
import * as z from "zod";

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
    .refine(
      async (password) => {
        const errorPassword = await checkPassword({ email: "", password });

        return errorPassword === true;
      },
      {
        message: "Mot de passe incorrect",
      }
    ),
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

//Password
export const PasswordFormSchema = z.object({
  password: z
    .string({
      required_error: "Le nouveau mot de passe est requis",
      invalid_type_error: "Le mot de passe doit être une chaîne de caractères",
    })
    .min(8, {
      message: "Le mot de passe doit comporter au moins 8 caractères.",
    }),
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
export type PasswordFormValues = z.infer<typeof PasswordFormSchema>;
export type DeliveryValues = z.infer<typeof DeliverySchema>;

export const defaultRegisterValues: Partial<RegisterValues> = {};
export const defaultLoginValues: Partial<LoginValues> = {};
export const defaultAccountValues: Partial<AccountFormValues> = {};
export const defaultPasswordValues: Partial<PasswordFormValues> = {};
export const defaultDeliveryValues: Partial<DeliveryValues> = {};

// export const RegisterUserSchema = z
//   .object({
//     name: z
//       .string({
//         required_error: "Name is required",
//       })
//       .min(1, "Full name is required"),
//     email: z
//       .string({
//         required_error: "Email is required",
//       })
//       .min(1, "Email is required")
//       .email("Email is invalid"),
//     photo: z.string().optional(),
//     password: z
//       .string({
//         required_error: "Password is required",
//       })
//       .min(1, "Password is required")
//       .min(8, "Password must be more than 8 characters")
//       .max(32, "Password must be less than 32 characters"),
//     passwordConfirm: z
//       .string({
//         required_error: "Confirm your password",
//       })
//       .min(1, "Confirm your password"),
//   })
//   .refine((data) => data.password === data.passwordConfirm, {
//     path: ["passwordConfirm"],
//     message: "Passwords do not match",
//   });

// export const LoginUserSchema = z.object({
//   email: z
//     .string({
//       required_error: "Email is required",
//     })
//     .min(1, "Email is required")
//     .email("Email is invalid"),
//   password: z
//     .string({
//       required_error: "Password is required",
//     })
//     .min(1, "Password is required")
//     .min(8, "Password must be at least 8 characters"),
// });
