export const nodemailerConfig = {
  host: process.env.EMAIL_SERVER_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.EMAIL_SERVER_PORT || "2525"),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER || "user",
    pass: process.env.EMAIL_SERVER_PASSWORD || "password",
  },
};
