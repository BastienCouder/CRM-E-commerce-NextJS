import "@/styles/globals.css";
import Navbar from "./(pages)/Navbar/Navbar";
import SessionProvider from "../context/SessionProvider";
import { AnimationProvider } from "../context/AnimationContext";
import { Toaster } from "sonner";
import CookieBanner from "@/components/CookieBanner";
import { cn } from "@/lib/utils";
import { Inter as FontSans, Roboto } from "next/font/google";
import { FontProvider } from "@/context/FontContext";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
