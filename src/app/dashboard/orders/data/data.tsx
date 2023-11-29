import {
  BadgePlus,
  CheckCheck,
  Loader,
  MoreHorizontal,
  Star,
  X,
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
  {
    value: "delete",
    label: "Supprimée",
    icon: X,
  },
];
