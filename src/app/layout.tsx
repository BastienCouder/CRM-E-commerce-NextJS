import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "./pages/Navbar/Navbar";
import SessionProvider from "../../context/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className}`}>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
