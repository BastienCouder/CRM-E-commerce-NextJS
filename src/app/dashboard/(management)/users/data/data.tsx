import {
  Contact,
  PackageSearch,
  Tag,
  User,
  UserCircleIcon,
} from "lucide-react";

export const roles = [
  {
    value: "ADMIN",
    label: "Administrateur",
    icon: UserCircleIcon,
  },
  {
    value: "PRODUCT_MANAGER",
    label: "Chef / Cheffe de production",
    icon: PackageSearch,
  },
  {
    value: "CUSTOMER_SERVICE",
    label: "Service clientèle",
    icon: Contact,
  },
  {
    value: "MARKETING_MANAGER",
    label: "Responsable marketing",
    icon: Tag,
  },
  {
    value: "USER",
    label: "Utilisateur",
    icon: User,
  },
];
