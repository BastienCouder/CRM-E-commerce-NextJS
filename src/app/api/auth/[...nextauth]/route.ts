import { AuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";
import { authProviders } from "./authProviders";
import NextAuth from "next-auth/next";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { mergeAnonymousCartIntoUserCart } from "@/lib/db/cart";
import { mergeAnonymousWishlistIntoUserCart } from "@/lib/db/wishlist";
import { mergeAnonymousDeliveryIntoUserCart } from "@/lib/db/delivery";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
  providers: authProviders,
  pages: {
    signIn: "/auth",
  },
  secret: env.NEXTAUTH_URL,
  // debug: process.env.NODE_ENV === "development",
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      await mergeAnonymousCartIntoUserCart(user.id);
      await mergeAnonymousWishlistIntoUserCart(user.id);
      // await mergeAnonymousDeliveryIntoUserCart(user.id);
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
