export default function formatPrice(price: number, locale: string) {
  let currency: string;

  switch (locale) {
    case "fr-FR":
      currency = "EUR";
      break;
    case "en-US":
      currency = "USD";
      break;
    case "en-GB":
      currency = "GBP";
      break;
    default:
      currency = "EUR";
      break;
  }

  return (price / 100).toLocaleString(locale, {
    style: "currency",
    currency: currency,
  });
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  return date.toLocaleString(undefined, options);
}

// Fonction pour calculer le numéro de la semaine dans l'année
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = Math.floor(
    (date.getTime() - firstDayOfYear.getTime()) / 86400000
  );
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Format pour la description trop longue
export function formatDescription(description: string): string {
  const words: string[] = description.split(" ");
  if (words.length <= 20) {
    return description;
  }
  const truncatedDescription = words.slice(0, 20).join(" ");
  return truncatedDescription + "...";
}

import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

// Format pour le pourcentage
interface FormattedPercentageResult {
  formattedPercentage: string;
  IconComponent: typeof ArrowUpCircle | typeof ArrowDownCircle;
}

export function formatPercentage(
  percentage: number | string
): FormattedPercentageResult {
  const number =
    typeof percentage === "string" ? parseFloat(percentage) : percentage;
  const isPositive = !isNaN(number) && number >= 0;

  const formattedPercentage = !isNaN(number)
    ? `${isPositive ? "+" : ""}${number.toFixed(2)}%`
    : percentage.toString();

  const IconComponent = isPositive ? ArrowUpCircle : ArrowDownCircle;

  return { formattedPercentage, IconComponent };
}

///format de la date
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  format,
  getISOWeek,
  isSameYear,
  parseISO,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";

export function formatDateBasedOnFilter(
  dateString: string,
  filterType: "day" | "week" | "2weeks" | "month"
): string {
  const date = parseISO(dateString);
  const now = new Date();
  const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });

  switch (filterType) {
    case "day":
      // Format pour les jours
      if (date >= startOfCurrentWeek) {
        // Si la date est dans la semaine actuelle
        return format(date, "EE d", { locale: fr });
      } else {
        return format(date, "EE d", { locale: fr });
      }

    case "week":
      // Format pour les semaines
      const weekNumber = getISOWeek(date);
      return `Semaine ${weekNumber}`;

    case "month":
      // Format pour les mois
      if (isSameYear(date, now)) {
        return format(date, "MMM", { locale: fr });
      } else {
        return format(date, "MMM yy", { locale: fr });
      }

    default:
      return dateString;
  }
}

export function determineFilterType(
  timeRange: string | { from: Date; to: Date }
): "day" | "week" | "2weeks" | "month" {
  if (typeof timeRange === "string") {
    switch (timeRange) {
      case "week":
        return "day";
      case "2weeks":
        return "day";
      case "month":
        return "week";
      default:
        return "month";
    }
  } else {
    const daysDiff = differenceInCalendarDays(timeRange.to, timeRange.from);
    const weeksDiff = differenceInCalendarWeeks(timeRange.to, timeRange.from);
    const monthsDiff = differenceInCalendarMonths(timeRange.to, timeRange.from);

    if (daysDiff <= 15 && weeksDiff === 0) {
      return "day";
    } else if (weeksDiff >= 1 && monthsDiff === 0) {
      return "week";
    } else {
      return "month";
    }
  }
}
