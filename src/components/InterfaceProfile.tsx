"use client";
import { useCallback, useState } from "react";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { AiFillFileText } from "react-icons/ai";
import { BiLogIn } from "react-icons/bi";
import { Session } from "next-auth";
import Logout from "@/components/Logout";
import Orders from "@/components/OrdersDetails";
import { OrderProps } from "@/lib/db/order";
import { DeliveryProps } from "@/lib/db/delivery";
import Info from "./ProfilePage";

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
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(
    "orders"
  );

  const handleMenuItemClick: (menuItem: string) => void = useCallback(() => {
    setSelectedMenuItem((menuItem) =>
      menuItem === "orders" ? "userInfo" : "orders"
    );
  }, []);

  return (
    <>
      <div className="flex gap-20 p-20">
        <div>
          <h1 className="text-2xl uppercase mb-4">
            Bonjour {session?.user?.name}
          </h1>

          <div className="flex flex-col gap-2 w-72 text-white">
            <div
              onClick={() => handleMenuItemClick("orders")}
              className={`cursor-pointer flex items-center gap-4 p-4 pl-0 border-b-2 border-secondary ${
                selectedMenuItem === "orders" ? "text-white" : ""
              }`}
            >
              <span>
                <BsFillBoxSeamFill size={24} />
              </span>
              <p>mes commandes</p>
            </div>
            <div
              onClick={() => handleMenuItemClick("userInfo")}
              className={`cursor-pointer flex items-center gap-4 p-4 pl-0 border-b-2 border-secondary ${
                selectedMenuItem === "userInfo" ? "text-white" : ""
              }`}
            >
              <span>
                <AiFillFileText size={24} />
              </span>
              <p>mes informations</p>
            </div>
            <div
              className={`cursor-pointer flex items-center gap-4 p-4 pl-0 border-b-2 border-secondary`}
            >
              <span>
                <BiLogIn size={24} />
              </span>
              <Logout />
            </div>
          </div>
        </div>
      </div>
      {selectedMenuItem === "orders" ? (
        <Orders order={order} />
      ) : (
        <Info delivery={delivery} session={session} />
      )}
    </>
  );
}
