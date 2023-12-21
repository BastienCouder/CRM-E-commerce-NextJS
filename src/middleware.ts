import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import UAParser from "ua-parser-js";
import { recordVisit, recordVisitorInfo } from "./lib/views";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const cookieStore = cookies();

  if (
    !url.startsWith("/_next/") &&
    !url.startsWith("/api/auth/session") &&
    !url.endsWith(".svg") &&
    !url.endsWith(".jpg") &&
    !url.endsWith(".png") &&
    !url.endsWith(".css") &&
    !url.endsWith(".js")
  ) {
    console.log(`Page requested: ${url}`);
    // recordVisit(url);
  }
  const cookieConsent = cookieStore.get("cookieConsent");

  if (cookieConsent) {
    let visitorId = cookieStore.get("visitorId");
    if (!visitorId) {
      const visitorId = uuidv4();
      const userAgent = req.headers.get("user-agent") || "";
      const ua = new UAParser(userAgent);
      const browserName = ua.getBrowser().name || "Unknown";
      const osName = ua.getOS().name || "Unknown";
      const deviceType = ua.getDevice().type || "Unknown";
      const location = ""; // Remplacer par la logique de géolocalisation réelle

      console.log(
        `Visitor requested: ${visitorId}, ${browserName},${osName},${location}`
      );
      recordVisitorInfo(visitorId, browserName, osName, location, deviceType);

      const response = NextResponse.next();
      response.cookies.set("visitorId", visitorId, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      return response;
    }
  }

  return NextResponse.next();
}
