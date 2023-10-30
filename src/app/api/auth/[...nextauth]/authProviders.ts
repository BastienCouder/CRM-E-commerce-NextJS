import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

const loginUserSchema = z.object({
  email: z
    .string()
    .min(5, "Email should be minimum 5 characters")
    .refine((email) => /\S+@\S+\.\S+/.test(email), {
      message: "Invalid email format",
    }),
  password: z.string().min(5, "Password should be minimum 5 characters"),
});

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
        const { email, password } = loginUserSchema.parse(credentials);
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
