import { BadgePlus, CheckCheck, Star, X, XSquare } from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "monitoring",
    label: "Surveillance",
  },
  {
    value: "correct",
    label: "Correct",
  },
];

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
    icon: XSquare,
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
