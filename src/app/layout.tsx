import "@/styles/globals.css";
import SessionProvider from "@/context/SessionProvider";
import { AnimationProvider } from "@/context/AnimationContext";
import { Toaster } from "sonner";
import { cn } from "@/helpers/utils";
import { aggregateAndCleanUpVisits } from "@/lib/db/views";
import { Inter } from "next/font/google";
import { getDictionary } from "@/app/lang/dictionaries";
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
  const auto = await aggregateAndCleanUpVisits();

  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <SessionProvider>
          <AnimationProvider>
            <NavBar dict={dict} cart={cart} />
            <main>{children}</main>
            {/* <CookieBanner /> */}
          </AnimationProvider>
        </SessionProvider>
        <Toaster expand={false} position="bottom-left" />
      </body>
    </html>
  );
}
