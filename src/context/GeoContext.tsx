"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

// Définissez un type pour les données de géolocalisation
type GeoDataType = {
  latitude: number;
  longitude: number;
};

// Définissez un type pour l'état du contexte
type GeoContextType = {
  geoData: GeoDataType | null;
};

// Valeur initiale pour le contexte
const initialGeoContext: GeoContextType = {
  geoData: null,
};

// Créez le contexte avec un type approprié
const GeoContext = createContext<GeoContextType>(initialGeoContext);

type GeoProviderProps = {
  children: ReactNode;
};

// Créez un fournisseur de contexte
export const GeoProvider: React.FC<GeoProviderProps> = ({ children }) => {
  const [geoData, setGeoData] = useState<GeoDataType | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setGeoData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      throw new Error("La géolocalisation n'est pas disponible.");
    }
  }, []);

  return (
    <GeoContext.Provider value={{ geoData }}>{children}</GeoContext.Provider>
  );
};

// Créez un hook personnalisé pour utiliser le contexte
export const useGeo = (): GeoContextType => useContext(GeoContext);
