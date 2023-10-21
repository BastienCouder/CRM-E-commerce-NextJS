import zod from "zod";

const envSchema = zod.object({
  ADMIN: zod.string().nonempty(),
  DATABASE_URL: zod.string().nonempty(),
  GOOGLE_ID: zod.string().nonempty(),
  GOOGLE_SECRET: zod.string().nonempty(),
  NEXTAUTH_URL: zod.string().nonempty(),
  NEXTAUTH_SECRET: zod.string().nonempty(),
  NEXTAUTH_JWT_SECRET: zod.string().nonempty(),
});

export const env = envSchema.parse(process.env);
