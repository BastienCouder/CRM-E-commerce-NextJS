import { NextRequest, NextResponse, userAgent } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import UAParser from "ua-parser-js";
import { recordVisitorInfo } from "@/lib/views";
import { mapBrowserName } from "./helpers/utils";
import Negotiator from "negotiator";

// Assurez-vous que les headers sont bien définis là où ils sont utilisés.
let headers = { "accept-language": "en-US,en;q=0.5" };
let languages = new Negotiator({ headers }).languages();
let locales = ["fr", "en", "us"];
let defaultLocale = "fr";

// La fonction getLocale doit être définie pour retourner une locale valide.
// Par exemple, vous pouvez la définir comme ci-dessous :
function getLocale(req: any) {
  const preferredLanguage = new Negotiator(req).language(locales);
  return preferredLanguage || defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getLocale(req);
  req.nextUrl.pathname = `/${locale}${pathname}`;

  // Visitor tracking logic
  const { device } = userAgent(req);
  let viewport = device.type === "mobile" ? "mobile" : "desktop";
  const url = req.nextUrl.pathname;

  const country = req.geo?.country || "US";

  const cookieStore = cookies();

  if (
    !url.startsWith("/_next/") &&
    !url.startsWith("/api/auth/session") &&
    !url.endsWith(".svg") &&
    !url.endsWith(".jpg") &&
    !url.endsWith(".png") &&
    !url.endsWith(".css") &&
    !url.endsWith(".js") &&
    !url.endsWith("json")
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
      const rawBrowserName = ua.getBrowser().name || "Unknown";
      const browserName = mapBrowserName(rawBrowserName);
      const osName = ua.getOS().name || "Unknown";
      const deviceType = viewport as "mobile" | "desktop";
      const city = req.geo?.city!;
      const country = req.geo?.country!;
      const region = req.geo?.region!;
      console.log(country, region, city);

      console.log(
        `Visitor requested: ${visitorId}, ${browserName},${osName},${deviceType}`
      );
      recordVisitorInfo(
        visitorId,
        browserName,
        osName,
        deviceType,
        city,
        country,
        region
      );

      const response = NextResponse.next();
      response.cookies.set("visitorId", visitorId, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      return response;
    }
  }

  return NextResponse.redirect(req.nextUrl);
}
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
