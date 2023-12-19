import { BadgePlus, CheckCheck, Plus, Star, X } from "lucide-react";

export const newsletters = [
  {
    value: true,
    label: "Abonée",
    icon: CheckCheck,
  },
  {
    value: null,
    label: "Non",
    icon: X,
  },
];

export const priorities = [
  { value: "best seller", label: "Best Seller", icon: BadgePlus },
  { value: "favorie", label: "Favorie", icon: Star },
  { value: "new", label: "Nouveau", icon: Plus },
];
