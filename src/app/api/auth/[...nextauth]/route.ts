import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "@/lib/env";
import { authProviders } from "./authProviders";
import { mergeAnonymousCartIntoUserCart } from "@/lib/db/cart";
import { mergeAnonymousWishlistIntoUserCart } from "@/lib/db/wishlist";
import NextAuth from "next-auth/next";
// import { mergeAnonymousDeliveryIntoUserCart } from "@/lib/db/delivery";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: authProviders,

  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        role: dbUser.role,
        email: dbUser.email,
        picture: dbUser.picture,
      };
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
