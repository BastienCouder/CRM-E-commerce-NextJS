"use client";
import { getLocalStorage, setLocalStorage } from "@/helpers/storageHelper";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState(
    getLocalStorage("cookie_consent", false)
  );

  useEffect(() => {
    setLocalStorage("cookie_consent", cookieConsent);
    console.log("Cookie Consent: ", cookieConsent);
  }, [cookieConsent]);

  const handleAcceptCookies = () => {
    setCookieConsent(true);
    setLocalStorage("cookie_consent", true);
    document.cookie = "cookieConsent=true; path=/; max-age=31536000"; // 1 an
  };

  const handleDeclineCookies = () => {
    setCookieConsent(false);
    setLocalStorage("cookie_consent", false);
    document.cookie = "cookieConsent=; path=/; max-age=0"; // Supprimer le cookie
  };

  if (!cookieConsent) {
    return (
      <div
        className={`fixed bottom-0 left-0 right-0 mx-auto my-10 max-w-max md:max-w-screen-sm
                    flex px-3 md:px-4 py-3 justify-between items-center flex-col sm:flex-row gap-4  
                    bg-gray-700 rounded-lg shadow`}
      >
        <div className="text-center">
          <Link href="/info/cookies">
            <p>
              We use <span className="font-bold text-sky-400">cookies</span>
              on our site.
            </p>
          </Link>
        </div>

        <div className="flex gap-2">
          <button className="..." onClick={handleAcceptCookies}>
            Allow Cookies
          </button>
          <button className="..." onClick={handleDeclineCookies}>
            Decline
          </button>
        </div>
      </div>
    );
  }

  return null;
}
