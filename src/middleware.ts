import { NextRequest, NextResponse, userAgent } from "next/server";
import { cookies } from "next/headers";
import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";
import Negotiator from "negotiator";

const { auth } = NextAuth(authConfig);

let headers = { "accept-language": "en-US,en;q=0.5" };
let languages = new Negotiator({ headers }).languages();
export let locales = ["fr", "en", "us"];
export let defaultLocale = "fr";

export function getLocale(
  req: NextRequest,
  defaultLocale: string,
  locales: string[]
) {
  const headers = Object.fromEntries(req.headers.entries());
  const negotiator = new Negotiator({ headers });
  const preferredLanguage = negotiator.language(locales);

  return preferredLanguage || defaultLocale;
}
export default auth((req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    // const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    // console.log(isLoggedIn);

    // return Response.redirect(
    //   new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    // );
  }

  const { pathname } = req.nextUrl;

  if (
    pathname === "/sitemap.xml" ||
    pathname === "/dashboard" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale(req, defaultLocale, locales);
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
    !url.endsWith("json") &&
    !url.endsWith(".ico")
  ) {
    // console.log(`Page requested: ${url}`);
    // recordVisit(url);
    // }
    //   const cookieConsent = cookieStore.get("cookieConsent");
    //   if (cookieConsent) {
    //     let visitorId = cookieStore.get("visitorId");
    //     // if (!visitorId) {
    //     //   const visitorId = uuidv4();
    //     //   const userAgent = req.headers.get("user-agent") || "";
    //     //   const ua = new UAParser(userAgent);
    //     //   const rawBrowserName = ua.getBrowser().name || "Unknown";
    //     //   const browserName = mapBrowserName(rawBrowserName);
    //     //   const osName = ua.getOS().name || "Unknown";
    //     //   const deviceType = viewport as "mobile" | "desktop";
    //     //   const city = req.geo?.city!;
    //     //   const country = req.geo?.country!;
    //     //   const region = req.geo?.region!;
    //     //   console.log(country, region, city);
    //     // console.log(
    //     //   `Visitor requested: ${visitorId}, ${browserName},${osName},${deviceType}`
    //     // );
    //     // recordVisitorInfo(
    //     //   visitorId,
    //     //   browserName,
    //     //   osName,
    //     //   deviceType,
    //     //   city,
    //     //   country,
    //     //   region
    //     // );
    //   const response = NextResponse.next();
    //   response.cookies.set("visitorId", visitorId, {
    //     httpOnly: true,
    //     sameSite: "strict",
    //     path: "/",
    //   });
    //   return response;
    // }
  }

  return NextResponse.redirect(new URL(`/${locale}/${pathname}`, req.url));
});
export const config = {
  matcher: ["/((?!_next/|svg/|images/|api/|dashboard/).*)"],
};
