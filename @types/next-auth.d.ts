import { UserRole } from "@prisma/client";
import NextAuth, { DefaultSession, User } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    id: userId;
    role: UserRole;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: userId;
      role: UserRole;
    };
  }
}
