"use client";
import { getLocalStorage, setLocalStorage } from "@/helpers/storageHelper";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState(() =>
    getLocalStorage("cookie_consent", false)
  );

  useEffect(() => {
    // Cette mise à jour est maintenant conditionnelle
    if (cookieConsent !== null) {
      setLocalStorage("cookie_consent", cookieConsent);

      // Mise à jour du cookie de consentement
      const consentValue = cookieConsent ? "true" : "; max-age=0";
      document.cookie = `cookieConsent=${consentValue}; path=/; max-age=31536000`;
    }
  }, [cookieConsent]);

  if (cookieConsent) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 mx-auto my-10 max-w-max md:max-w-screen-sm
                flex px-3 md:px-4 py-3 justify-between items-center flex-col sm:flex-row gap-4  
                bg-gray-700 rounded-lg shadow"
    >
      <div className="text-center">
        <Link href="/info/cookies">
          <p>
            We use <span className="font-bold text-sky-400">cookies</span> on
            our site.
          </p>
        </Link>
      </div>

      <div className="flex gap-2">
        <button
          className="your-button-class"
          onClick={() => setCookieConsent(true)}
        >
          Allow Cookies
        </button>
        <button
          className="your-button-class"
          onClick={() => setCookieConsent(false)}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
