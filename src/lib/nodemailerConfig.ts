import { env } from "./env";

export const nodemailerConfig = {
  host: env.EMAIL_SERVER_HOST || "smtp.mailtrap.io",
  port: parseInt(env.EMAIL_SERVER_PORT || "2525"),
  secure: false,
  auth: {
    user: env.EMAIL_SERVER_USER || "user",
    pass: env.EMAIL_SERVER_PASSWORD || "password",
  },
};
