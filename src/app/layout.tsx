import "@/styles/globals.css";
import Navbar from "./(pages)/Navbar/Navbar";
import SessionProvider from "../context/SessionProvider";
import { AnimationProvider } from "../context/AnimationContext";
import { Toaster } from "sonner";
import { cn } from "@/helpers/utils";
import { Inter as FontSans, Roboto } from "next/font/google";
import { FontProvider } from "@/context/FontContext";
import CookieBanner from "@/components/CookieBanner";
import { aggregateAndCleanUpVisits } from "@/lib/views";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontRoboto = Roboto({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-roboto",
});

export const metadata = {
  title: "E-commerce",
  description: "Ceci est la page d'accueil de mon application.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Exécuter la fonction
  const auto = await aggregateAndCleanUpVisits();

  return (
    <html lang="fr">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontRoboto.variable
        )}
      >
        <SessionProvider>
          <AnimationProvider>
            <Navbar />

            <FontProvider>
              <main>{children}</main>
            </FontProvider>
            <CookieBanner />
          </AnimationProvider>
        </SessionProvider>
        <Toaster expand={false} position="bottom-left" />
      </body>
    </html>
  );
}
