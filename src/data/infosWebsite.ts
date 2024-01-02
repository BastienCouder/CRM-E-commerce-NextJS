import { env } from "@/lib/env";

const name = `${env.NAME_WEBSITE}`;

const website = {
  name: `${name}`,
  email: `example@example.com`,
  phone: `00000000`,
  address: `[........]`,
  creator: `2023 Bastien Couder`,
};

export default website;

export const utils = {
  protected:
    "ADMIN" || "PRODUCT_MANAGER" || "CUSTOMER_SERVICE" || "MARKETING_MANAGER",
};
