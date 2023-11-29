import { BadgePlus, CheckCheck, Star, X } from "lucide-react";

export const statuses = [
  {
    value: "available",
    label: "Disponible",
    icon: CheckCheck,
  },
  {
    value: "unavailable",
    label: "Indisponible",
    icon: X,
  },
  {
    value: "delete",
    label: "Supprimer",
    icon: X,
  },
];

export const priorities = [
  {
    label: "Favorie",
    value: "favorites",
    icon: Star,
  },
  {
    label: "Nouveautés",
    value: "new",
    icon: BadgePlus,
  },
];
