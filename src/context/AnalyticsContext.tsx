"use client";
import React, { createContext, useContext, ReactNode } from "react";
import Script from "next/script";

// Création du contexte
const AnalyticsContext = createContext(null);

// Création du provider
export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AnalyticsContext.Provider value={null}>
      {children}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
    </AnalyticsContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAnalytics = () => {
  return useContext(AnalyticsContext);
};
