import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/lib/env";

export const authProviders = [
  GoogleProvider({
    clientId: env.GOOGLE_ID!,
    clientSecret: env.GOOGLE_SECRET!,
  }),
  // EmailProvider({
  //   server: {
  //     host: env.EMAIL_SERVER_HOST,
  //     port: env.EMAIL_SERVER_PORT,
  //     auth: {
  //       user: env.EMAIL_SERVER_USER,
  //       pass: env.EMAIL_SERVER_PASSWORD,
  //     },
  //   },
  //   from: env.EMAIL_FROM,
  //   sendVerificationRequest({ identifier, url, provider }) {
  //     CustomsendVerificationRequest({ identifier, url, provider });
  // },
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
          throw new Error("Adresse e-mail et mot de passe requis");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email as string,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Adresse e-mail incorrecte");
        }

        const isCorrectPassword = await compare(
          credentials?.password as string,
          user.hashedPassword as string
        );

        if (!isCorrectPassword) {
          throw new Error("Mot de passe incorrect");
        }
        return user;
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
