import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { env } from "@/lib/env";

export const authProviders = [
  GoogleProvider({
    clientId: process.env.GOOGLE_ID || "",
    clientSecret: process.env.GOOGLE_SECRET || "",
  }),
  Credentials({
    id: "credentials",
    name: "Credentials",
    credentials: {
      email: {
        label: "Email",
        type: "text",
      },
      password: {
        label: "Mot de passe",
        type: "password",
      },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.email || !credentials?.password) {
          throw Error("Adresse e-mail et mot de passe requis");
        }

        let user = await prisma.user.findUnique({
          where: {
            email: credentials?.email as string,
          },
        });

        if (!user || !user.hashedPassword) {
          throw Error("Adresse e-mail incorrecte");
        }

        const isCorrectPassword = await compare(
          credentials?.password as string,
          user.hashedPassword as string
        );

        if (!isCorrectPassword) {
          throw Error("Mot de passe incorrect");
        }

        if (user.email === env.ADMIN) {
          user.role = "admin";
        } else {
          user.role = "user";
        }
        user = {
          email: credentials?.email,
          password: isCorrectPassword,
          role: user.role,
        };

        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de l'authentification :",
          error
        );
        throw error;
      }
    },
  }),
];
