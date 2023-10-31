import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { checkEmail, checkPassword } from "@/app/auth/action";

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
        if (credentials?.email || credentials?.password) {
          const isCorrectPassword = await checkPassword(credentials);

          if (!isCorrectPassword) {
            throw Error("Mot de passe incorrect");
          }

          const user = await checkEmail(credentials);

          if (user) {
            return {
              id: user.id,
              username: user.username,
              email: user.email,
            };
          }
        }

        return null;
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
