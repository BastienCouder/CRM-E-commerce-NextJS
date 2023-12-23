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

export function formatDescription(description: string): string {
  const words: string[] = description.split(" ");
  if (words.length <= 20) {
    return description;
  }
  const truncatedDescription = words.slice(0, 20).join(" ");
  return truncatedDescription + "...";
}
