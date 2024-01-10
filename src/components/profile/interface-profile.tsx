"use client";

import { useState } from "react";
import { Session } from "next-auth";
import Orders from "@/components/profile/orders-details";
import { OrderProps } from "@/lib/db/order";
import { DeliveryProps } from "@/lib/db/delivery";
import InformationUser from "./information-user";
import { LogoutButton } from "../auth/logout-button";
import SettingsUser from "./settings-user";
import { Box, FileStack, LogOut, Settings, Tag } from "lucide-react";

interface InterfaceProfileProps {
  session: Session | null;
  order: OrderProps | null;
  delivery: DeliveryProps | null;
}
export default function InterfaceProfile({
  session,
  order,
  delivery,
}: InterfaceProfileProps) {
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("orders");

  const handleMenuItemClick = (menuItem: string) => {
    setSelectedMenuItem(menuItem);
  };

  return (
    <>
      <div className="flex gap-20 p-14">
        {/* Menu */}
        <div>
          <h1 className="text-2xl uppercase mb-4">
            bonjour {session?.user?.name}
          </h1>
          <div className="flex flex-col gap-2 w-72 text-white">
            {/* Orders */}
            <div
              onClick={() => handleMenuItemClick("orders")}
              className={`cursor-pointer flex items-center gap-4 p-4 pl-0 border-b-2 border-secondary ${
                selectedMenuItem === "orders" ? "text-white" : ""
              }`}
            >
              <Box size={24} />
              <p>mes commandes</p>
            </div>
            {/* User Info */}
            <div
              onClick={() => handleMenuItemClick("userInfo")}
              className={`cursor-pointer flex items-center gap-4 p-4 pl-0 border-b-2 border-secondary ${
                selectedMenuItem === "userInfo" ? "text-white" : ""
              }`}
            >
              <FileStack size={24} />
              <p>mes informations</p>
            </div>
            {/* Settings */}
            <div
              onClick={() => handleMenuItemClick("settings")}
              className={`cursor-pointer flex items-center gap-4 p-4 pl-0 border-b-2 border-secondary ${
                selectedMenuItem === "settings" ? "text-white" : ""
              }`}
            >
              <Settings size={24} />
              <p>paramètres</p>
            </div>
            {/* Newsletter */}
            <div
              onClick={() => handleMenuItemClick("newsletter")}
              className={`cursor-pointer flex items-center gap-4 p-4 pl-0 border-b-2 border-secondary ${
                selectedMenuItem === "newsletter" ? "text-white" : ""
              }`}
            >
              <Tag size={24} />
              <p>newsletter</p>
            </div>
            {/* Logout */}
            <div
              onClick={() => handleMenuItemClick("newsletter")}
              className={`cursor-pointer flex items-center gap-4 p-4 pl-0 border-b-2 border-secondary 
              }`}
            >
              <LogOut size={24} />
              <LogoutButton>déconnexion</LogoutButton>
            </div>
          </div>
        </div>

        {/* Content based on selected menu item */}
        {selectedMenuItem === "orders" && <Orders order={order} />}
        {selectedMenuItem === "userInfo" && (
          <InformationUser delivery={delivery} />
        )}
        {selectedMenuItem === "settings" && <SettingsUser />}
        {/* {selectedMenuItem === "newsletter" && <Newsletter />} */}
      </div>
    </>
  );
}
