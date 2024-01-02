"use client";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { getCode } from "country-list";
import {
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Locate,
  LocateFixed,
  Map,
  MapPin,
  MoreHorizontal,
  Navigation,
  Radar,
} from "lucide-react";
import { useState } from "react";

interface GeoData {
  country?: string;
  users: number;
  flag?: string | JSX.Element;
  city?: string;
}

const geoCountryData: GeoData[] = [
  { country: "France", users: 12000 },
  { country: "United States of America", users: 30000 },
  { country: "India", users: 25000 },
  { country: "China", users: 35000 },
  { country: "Brazil", users: 15000 },
  { country: "Germany", users: 10000 },
];

const geoCityData: GeoData[] = [
  // Ajouter des données spécifiques à chaque ville
  { city: "Paris", users: 5000 },
  { city: "New York", users: 10000 },
  { city: "Mumbai", users: 8000 },
  { city: "Beijing", users: 12000 },
  { city: "Sao Paulo", users: 7000 },
  { city: "Berlin", users: 4000 },
];

export default function GeoChart() {
  const [displayMode, setDisplayMode] = useState<"country" | "city">("city");

  const handleModeChange = (mode: "country" | "city") => {
    setDisplayMode(mode);
  };

  const icons = [
    <MapPin key="map-pin" color="rgb(var(--chart))" />,
    <Map key="map" color="rgb(var(--chart))" />,
    <Navigation key="navigation" color="rgb(var(--chart))" />,
    <Radar key="radar" color="rgb(var(--chart))" />,
    <LocateFixed key="locate" color="rgb(var(--chart))" />,
  ];
  function shuffle(array: JSX.Element[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffle(icons);

  const enrichedData =
    displayMode === "country"
      ? geoCountryData.map((data) => ({
          ...data,
          flag: getCode(data.country!)?.toLowerCase() || "unknown",
        }))
      : geoCityData.map((data, index) => ({
          ...data,
          flag: icons[index % icons.length],
        }));

  return (
    <>
      <section className="border w-3/5 p-4 h-[20rem] rounded-lg bg-card space-y-4">
        <div className="w-full flex justify-between mb-2">
          <h2>Visiteurs par {displayMode === "country" ? "pays" : "ville"}</h2>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="bg-background py-px px-1 rounded-lg">
                  <MoreHorizontal />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto py-1.5 px-2 bg-background space-y-2"
                align="end"
              >
                <p
                  onClick={() => handleModeChange("country")}
                  className="cursor-pointer"
                >
                  Pays
                </p>
                <Separator />
                <p
                  onClick={() => handleModeChange("city")}
                  className="cursor-pointer"
                >
                  Villes
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Separator className="bg-[rgba(var(--foreground),0.5)]" />

        <div className="w-full h-full flex justify-between">
          <ul className="space-y-4">
            {enrichedData
              .sort((a, b) => b.users - a.users)
              .slice(0, 5)
              .map((data, index) => (
                <li key={index} className="flex gap-x-4 items-center">
                  {typeof data.flag === "string" ? (
                    <span
                      className={`fi fi-${data.flag} py-1 px-4 rounded-lg`}
                    ></span>
                  ) : (
                    <span className="py-1 px-4 rounded-lg">{data.flag}</span>
                  )}
                  <p className="flex items-center gap-x-2">
                    {displayMode === "country" ? data.country : data.city}{" "}
                    <span className="h-px w-[2rem] bg-chart mt-1"></span>{" "}
                    {data.users}
                  </p>
                </li>
              ))}
          </ul>
          <Image
            src={"/svg/world.svg"}
            alt="worldmap"
            width={1000}
            height={1000}
            className="w-[30rem] h-[14rem] mt-2"
          />
        </div>
      </section>
    </>
  );
}
