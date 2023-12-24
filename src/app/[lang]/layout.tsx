import "@/styles/globals.css";
import SessionProvider from "@/context/SessionProvider";
import { AnimationProvider } from "@/context/AnimationContext";
import { Toaster } from "sonner";
import { cn } from "@/helpers/utils";
import { FontProvider } from "@/context/FontContext";
import { aggregateAndCleanUpVisits } from "@/lib/views";
import { Inter } from "next/font/google";
import { getDictionary } from "./dictionaries/dictionaries";
import { getCart } from "@/lib/db/cart";
import NavBar from "./(pages)/Navbar/NavBar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
  params: { lang },
}: {
  params: {
    lang: string;
  };
  children: React.ReactNode;
}) {
  const dict = await getDictionary(lang);
  const cart = await getCart();
  // Exécuter la fonction
  const auto = await aggregateAndCleanUpVisits();

  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <SessionProvider>
          <AnimationProvider>
            <NavBar dict={dict} cart={cart} />
            <FontProvider>
              <main>{children}</main>
            </FontProvider>
            {/* <CookieBanner /> */}
          </AnimationProvider>
        </SessionProvider>
        <Toaster expand={false} position="bottom-left" />
      </body>
    </html>
  );
}
