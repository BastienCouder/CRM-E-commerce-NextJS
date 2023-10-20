import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";

import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { env } from "@/lib/env";
const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
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

          const user = await prisma.user.findUnique({
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
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  secret: env.NEXTAUTH_URL,
  debug: process.env.NODE_ENV === "development",
  // callbacks: {
  //   async jwt({ token, account }) {
  //     if (account) {
  //       token.accessToken = account.access_token;
  //     }
  //     return token;
  //   },
  //   async session({ session, token, user }: any) {
  //     session.accessToken = token.accessToken;
  //     return session;
  //   },
  //   async signIn({ user, account, profile }: any) {
  //     console.log("Utilisateur connecté :", user);
  //     console.log("Profil de l'utilisateur :", profile);

  //     const existingUser = await prisma.user.findUnique({
  //       where: {
  //         email: user.email,
  //       },
  //     });

  //     if (!existingUser) {
  //       await prisma.user.create({
  //         data: {
  //           email: user.email,
  //           name: profile.name,
  //         },
  //       });
  //     }
  //     return true;
  //   },
  // },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
