import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { LoginSchema } from "@/lib/zod";

const prisma = new PrismaClient();

export const authProviders = [
  GoogleProvider({
    clientId: process.env.GOOGLE_ID || "",
    clientSecret: process.env.GOOGLE_SECRET || "",
  }),
  Credentials({
    credentials: {
      email: { type: "text" },
      password: { type: "password" },
    },
    async authorize(credentials, req) {
      try {
        const { email, password } = LoginSchema.parse(credentials);
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        if (password !== null && user.hashedPassword) {
          const isPasswordValid = await bcrypt.compare(
            password,
            user.hashedPassword
          );

          if (!isPasswordValid) return null;
        } else {
          return null;
        }
        console.log(user);

        return user;
      } catch (error) {
        console.error("An error occurred during authentication:", error);
        throw error;
      }
    },
  }),
];
