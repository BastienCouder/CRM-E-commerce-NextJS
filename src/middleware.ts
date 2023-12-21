import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { pageVisit } from "@/lib/pageVisit";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
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
    // pageVisit(url);
  }

  const cookieConsent = (req.cookies as any)["cookieConsent"];

  if (cookieConsent === "true") {
    let visitorId = (req.cookies as any)["visitorId"];
    if (!visitorId) {
      visitorId = uuidv4(); // Générer un UUID pour le nouveau visiteur
      // Enregistrer le nouveau visiteur dans la base de données ou système de stockage
      // ...

      // Définir le cookie dans la réponse
      const response = NextResponse.next();
      response.cookies.set("visitorId", visitorId, {
        httpOnly: true,
        sameSite: "strict",
      });
      return response;
    }
  }

  // Ici, vous pouvez ajouter du code pour enregistrer les visites de page
  // Par exemple, enregistrer dans une base de données ou envoyer à un service d'analyse

  return NextResponse.next();
}
