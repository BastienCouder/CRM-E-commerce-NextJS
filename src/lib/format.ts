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
  };

  return date.toLocaleString(undefined, options);
}
