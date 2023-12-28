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

export const formatDateMonth = (
  dateString: string,
  format: "short" | "long" = "short"
) => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    month: format,
  };

  return new Intl.DateTimeFormat("fr-FR", options).format(date);
};

function isoWeekNumber(date: Date): number {
  const target = new Date(date);
  const dayNr = (date.getDay() + 6) % 7; // Transforme dimanche en 0, lundi en 1, etc.
  target.setDate(target.getDate() - dayNr + 3); // Jeudi de la semaine actuelle

  const firstThursday = target.getTime(); // Convertit en timestamp
  target.setMonth(0, 1);

  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }

  const startOfYear = target.getTime(); // Convertit également en timestamp
  const weekNumber = 1 + Math.ceil((firstThursday - startOfYear) / 604800000); // Divise les timestamps

  return weekNumber;
}

// Fonction pour calculer le numéro de la semaine dans l'année
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = Math.floor(
    (date.getTime() - firstDayOfYear.getTime()) / 86400000
  );
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export function formatDescription(description: string): string {
  const words: string[] = description.split(" ");
  if (words.length <= 20) {
    return description;
  }
  const truncatedDescription = words.slice(0, 20).join(" ");
  return truncatedDescription + "...";
}
