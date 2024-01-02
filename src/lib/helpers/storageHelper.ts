export function getLocalStorage(key: string, defaultValue: any) {
  // Vérifier si window est défini (i.e., si le code s'exécute dans un navigateur)
  if (typeof window !== "undefined") {
    const stickyValue = localStorage.getItem(key);
    return stickyValue !== null && stickyValue !== "undefined"
      ? JSON.parse(stickyValue)
      : defaultValue;
  }
  return defaultValue;
}

export function setLocalStorage(key: string, value: any) {
  // Vérifier si window est défini
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
