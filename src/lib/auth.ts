import { auth } from "@/auth";
import { Session } from "next-auth";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};

import { NextResponse } from "next/server";

const roles = {
  protected: [
    "ADMIN",
    "PRODUCT_MANAGER",
    "CUSTOMER_SERVICE",
    "MARKETING_MANAGER",
  ],
};

export function roleCheckMiddleware(session: any) {
  if (session && roles.protected.includes(session.role)) {
    return NextResponse.next();
  }

  return new NextResponse(null, { status: 403 });
}
