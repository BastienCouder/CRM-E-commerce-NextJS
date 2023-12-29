import { CheckCheck, User, User2, UserCircleIcon, X } from "lucide-react";

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
  {
    value: false,
    label: "Non",
    icon: X,
  },
];
export const roles = [
  {
    value: "admin",
    label: "Administrateur",
    icon: UserCircleIcon,
  },
  {
    value: "user",
    label: "Utilisateur",
    icon: User,
  },
];
