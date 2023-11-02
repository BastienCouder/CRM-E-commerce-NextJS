import z from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
  NEXTAUTH_URL: z.string().nonempty(),
  GOOGLE_ID: z.string().nonempty(),
  GOOGLE_SECRET: z.string().nonempty(),
  NEXTAUTH_SECRET: z.string().nonempty(),
  NEXTAUTH_JWT_SECRET: z.string().nonempty(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string().nonempty(),
});

export const env = envSchema.parse(process.env);

export const getEnvIssues = (): z.ZodIssue[] | void => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;
};
