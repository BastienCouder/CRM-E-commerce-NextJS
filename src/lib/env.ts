import z from "zod";

export const envSchema = z.object({
  CREATE_WEBSITE: z.string().nonempty(),
  NEXT_PUBLIC_GA_ID: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
  NEXTAUTH_URL: z.string().nonempty(),
  GOOGLE_ID: z.string().nonempty(),
  GOOGLE_SECRET: z.string().nonempty(),
  NEXTAUTH_SECRET: z.string().nonempty(),
  NEXTAUTH_JWT_SECRET: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string().nonempty(),
  EMAIL_SERVER_USER: z.string().nonempty(),
  EMAIL_SERVER_PASSWORD: z.string().nonempty(),
  EMAIL_SERVER_HOST: z.string().nonempty(),
  EMAIL_SERVER_PORT: z.string().nonempty(),
  EMAIL_FROM: z.string().nonempty(),
  NODE_ENV: z.string().nonempty(),
});

export const env = envSchema.parse(process.env);

export const getEnvIssues = (): z.ZodIssue[] | void => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;
};
