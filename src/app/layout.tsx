import "@/styles/globals.css";
import SessionProvider from "@/context/SessionProvider";
import { AnimationProvider } from "@/context/AnimationContext";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { aggregateAndCleanUpVisits } from "@/lib/db/views";
import { Inter } from "next/font/google";
import { getDictionary } from "../lang/dictionaries";
import { getCart } from "@/lib/db/cart";
import NavBar from "./[lang]/(pages)/Navbar/NavBar";
import { getCategories } from "@/lib/db/category";

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
  const categories = await getCategories();
  const auto = await aggregateAndCleanUpVisits();

  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <SessionProvider>
          <AnimationProvider>
            <NavBar dict={dict} cart={cart} categories={categories!} />
            <main>{children}</main>
            {/* <CookieBanner /> */}
          </AnimationProvider>
        </SessionProvider>
        <Toaster expand={false} position="bottom-left" />
      </body>
    </html>
  );
}
