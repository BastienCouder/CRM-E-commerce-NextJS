"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (document.cookie.indexOf("cookies_accepted=") === -1) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    setShowBanner(false);

    document.cookie =
      "cookies_accepted=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed flex flex-col md:flex-row bottom-0 w-full bg-zinc-800/80 p-4 md:p-6 md:space-x-8 space-y-4">
      <div className="flex flex-col gap-y-2">
        <p className="text-sm md:text-base">
          Nous utilisons des cookies pour améliorer votre expérience. En
          continuant à utiliser ce site, vous acceptez notre utilisation des
          cookies.
        </p>
        <div>
          <Link
            href="/politique-de-confidentialite"
            className="text-sm border-b"
          >
            Politique de confidentialité
          </Link>
        </div>
      </div>
      <div>
        <Button onClick={handleAcceptCookies}>Accepter</Button>
      </div>
    </div>
  );
}

export default CookieBanner;
