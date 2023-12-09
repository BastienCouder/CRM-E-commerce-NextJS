export default function formatPrice(price: number, currency: string) {
  let locale;

  if (currency === "EUR") {
    locale = "fr-FR";
  } else {
    locale = "en-US";
  }

  return (price / 100).toLocaleString(locale, {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
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

  const options: Intl.DateTimeFormatOptions = { month: format };

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
