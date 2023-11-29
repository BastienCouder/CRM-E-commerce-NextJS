import {
  BadgePlus,
  CheckCheck,
  Loader,
  MoreHorizontal,
  Star,
  X,
  XSquare,
} from "lucide-react";

export const statuses = [
  {
    value: "waiting",
    label: "En attente",
    icon: Loader,
  },
  {
    value: "in progress",
    label: "En cours",
    icon: MoreHorizontal,
  },
  {
    value: "delivered",
    label: "Livrée",
    icon: CheckCheck,
  },
  {
    value: "cancel",
    label: "Annulée",
    icon: X,
  },
  {
    value: "refunded",
    label: "Remboursée",
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
