import { Session } from "next-auth";
import { env } from "./env";

export function checkAdminRole(session: Session | null) {
  if (session) {
    if (session.user && session.user.email === env.ADMIN) {
      session.user.role = "admin";
    }
  }

  return session;
}
