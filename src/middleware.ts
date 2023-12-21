import { NextRequest, NextResponse, userAgent } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import UAParser from "ua-parser-js";
import { recordVisitorInfo } from "./lib/views";

export function middleware(req: NextRequest) {
  const { device } = userAgent(req);
  let viewport = device.type === "mobile" ? "mobile" : "desktop";

  const { nextUrl: url, geo } = req;
  const country = geo?.country || "US";

  url.searchParams.set("country", country);

  const cookieStore = cookies();

  if (
    !url.pathname.startsWith("/_next/") &&
    !url.pathname.startsWith("/api/auth/session") &&
    !url.pathname.endsWith(".svg") &&
    !url.pathname.endsWith(".jpg") &&
    !url.pathname.endsWith(".png") &&
    !url.pathname.endsWith(".css") &&
    !url.pathname.endsWith(".js")
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
      const deviceType = viewport;
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

  return NextResponse.next();
}
