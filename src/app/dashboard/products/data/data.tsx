import { BadgePlus, CheckCheck, Plus, Star, X } from "lucide-react";

export const statusesProducts = [
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
  { value: "best seller", label: "Best Seller", icon: BadgePlus },
  { value: "favorie", label: "Favorie", icon: Star },
  { value: "new", label: "Nouveau", icon: Plus },
];
