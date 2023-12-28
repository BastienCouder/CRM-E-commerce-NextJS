"use client";
import { useState, useEffect } from "react";
import { addWeeks, addMonths } from "date-fns";

export function useFilteredAnalyticsData<T>(
  fetchData: (startDate: Date, endDate: Date) => Promise<T>,
  initialTimeRange: string = "Ce mois"
): [
  T,
  string,
  (timeRange: string) => void,
  { value: string; label: string }[]
] {
  const options = [
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
    { value: "3months", label: "3 Mois" },
    { value: "6months", label: "6 Mois" },
    { value: "12months", label: "12 Mois" },
  ];
  const [timeRange, setTimeRange] = useState<string>(initialTimeRange);
  const [filteredData, setFilteredData] = useState<T>();

  useEffect(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (timeRange) {
      case "week":
        startDate = addWeeks(now, -1);
        break;
      case "month":
        startDate = addMonths(now, -1);
        break;
      case "3months":
        startDate = addMonths(now, -3);
        break;
      case "6months":
        startDate = addMonths(now, -6);
        break;
      case "12months":
        startDate = addMonths(now, -12);
        break;
      default:
        startDate = addMonths(now, -1);
    }

    fetchData(startDate, endDate)
      .then((response) => {
        setFilteredData(response);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, [timeRange, fetchData]);

  return [filteredData!, timeRange!, setTimeRange, options];
}
