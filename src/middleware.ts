import { NextRequest, NextResponse, userAgent } from "next/server";
import { cookies } from "next/headers";
// import { v4 as uuidv4 } from "uuid";
// import UAParser from "ua-parser-js";
// import { recordVisitorInfo } from "@/lib/db/views";
// import { mapBrowserName } from "./lib/utils";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import nextAuth from "next-auth";

const { auth } = nextAuth(authConfig);

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

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return null;
});

export function middleware(req: NextRequest) {
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
    // console.log(`Page requested: ${url}`);
    // recordVisit(url);
  }
  const cookieConsent = cookieStore.get("cookieConsent");

  if (cookieConsent) {
    let visitorId = cookieStore.get("visitorId");
    // if (!visitorId) {
    //   const visitorId = uuidv4();
    //   const userAgent = req.headers.get("user-agent") || "";
    //   const ua = new UAParser(userAgent);
    //   const rawBrowserName = ua.getBrowser().name || "Unknown";
    //   const browserName = mapBrowserName(rawBrowserName);
    //   const osName = ua.getOS().name || "Unknown";
    //   const deviceType = viewport as "mobile" | "desktop";
    //   const city = req.geo?.city!;
    //   const country = req.geo?.country!;
    //   const region = req.geo?.region!;
    //   console.log(country, region, city);

    // console.log(
    //   `Visitor requested: ${visitorId}, ${browserName},${osName},${deviceType}`
    // );
    // recordVisitorInfo(
    //   visitorId,
    //   browserName,
    //   osName,
    //   deviceType,
    //   city,
    //   country,
    //   region
    // );

    //   const response = NextResponse.next();
    //   response.cookies.set("visitorId", visitorId, {
    //     httpOnly: true,
    //     sameSite: "strict",
    //     path: "/",
    //   });
    //   return response;
    // }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/statict|svg|_next/image|favicon.ico).*)"],
};

// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { v4 as uuidv4 } from "uuid";
// import UAParser from "ua-parser-js";
// import { recordVisitorInfo } from "@/lib/views";
// import { mapBrowserName } from "@/helpers/utils";

// const locales: string[] = ["fr", "en", "us"];
// const defaultLocale: string = "fr";

// function getLocale(req: NextRequest): string {
//   const acceptLang: string | null = req.headers.get("accept-language");
//   return (
//     acceptLang
//       ?.split(",")
//       .map((lang) => lang.split(";")[0])
//       .find((lang) => locales.includes(lang)) ?? defaultLocale
//   );
// }
// export function middleware(req: NextRequest): NextResponse {
//   const { pathname } = req.nextUrl;

//   if (
//     pathname.startsWith("/_next/") ||
//     pathname.startsWith("/svg/") ||
//     pathname.startsWith("/images/") ||
//     pathname.startsWith("/api/")
//   ) {
//     return NextResponse.next();
//   }

//   if (
//     !locales.some(
//       (locale) =>
//         pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//     )
//   ) {
//     req.nextUrl.pathname = `/${getLocale(req)}${pathname}`;
//   }

//   // Visitor tracking logic
//   const uaParser = new UAParser(req.headers.get("user-agent") || "");
//   const deviceType =
//     uaParser.getDevice().type === "mobile" ? "mobile" : "desktop";
//   const cookieStore = cookies();
//   if (
//     !pathname.startsWith("/_next/") &&
//     !pathname.startsWith("/api/auth/session") &&
//     !pathname.endsWith(".svg") &&
//     !pathname.endsWith(".jpg") &&
//     !pathname.endsWith(".png") &&
//     !pathname.endsWith(".css") &&
//     !pathname.endsWith(".js") &&
//     !pathname.endsWith(".json")
//   ) {
//     // console.log(`Page requested: ${url}`);
//     // recordVisit(url);
//   }
//   let alreadyVisitor = cookieStore.get("visitorId");
//   const cookieConsent = cookieStore.get("cookieConsent");
//   if (!alreadyVisitor && cookieConsent) {
//     let visitorId = uuidv4();
//     const browserName = mapBrowserName(uaParser.getBrowser().name || "Unknown");
//     const osName = uaParser.getOS().name || "Unknown";
//     const city = req.geo?.city || "Unknown";
//     const country = req.geo?.country || "Unknown";
//     const region = req.geo?.region || "Unknown";

//     console.log(
//       `Visitor requested: ${visitorId}, ${browserName},${osName},${deviceType}`
//     );
//     recordVisitorInfo(
//       visitorId,
//       browserName,
//       osName,
//       deviceType,
//       city,
//       country,
//       region
//     );

//     const response = NextResponse.next();
//     response.cookies.set("visitorId", visitorId, {
//       httpOnly: true,
//       sameSite: "strict",
//       path: "/",
//     });
//     return response;
//   }

//   return NextResponse.redirect(req.nextUrl);
// }

// export const config = {
//   matcher: "/((?!_next|svg|api).*)",
// };
