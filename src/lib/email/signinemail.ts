import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { createTransport } from "nodemailer";
import { env } from "../env";

export async function CustomsendVerificationRequest(params: Params) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);
  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Se connecter à ${host}`,
    // text: text({ url, host }),
    // html: html({ url, host, theme }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) n'a pas pu être envoyé`);
  }
}
