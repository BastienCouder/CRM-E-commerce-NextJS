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
  isLoading: boolean;
  error: string | null;
};

// Valeur initiale pour le contexte
const initialGeoContext: GeoContextType = {
  geoData: null,
  isLoading: true,
  error: null,
};

// Créez le contexte avec un type approprié
const GeoContext = createContext<GeoContextType>(initialGeoContext);

type GeoProviderProps = {
  children: ReactNode;
};

// Créez un fournisseur de contexte
export const GeoProvider: React.FC<GeoProviderProps> = ({ children }) => {
  const [geoData, setGeoData] = useState<GeoDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (err) => {
          setError(err.message);
          setIsLoading(false);
        }
      );
    } else {
      setError("La géolocalisation n'est pas disponible.");
      setIsLoading(false);
    }
  }, []);

  return (
    <GeoContext.Provider value={{ geoData, isLoading, error }}>
      {children}
    </GeoContext.Provider>
  );
};

// Créez un hook personnalisé pour utiliser le contexte
export const useGeo = (): GeoContextType => useContext(GeoContext);
