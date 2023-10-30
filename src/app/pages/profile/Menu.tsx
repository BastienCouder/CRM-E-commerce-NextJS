"use client";
import { useCallback, useState } from "react";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { AiFillFileText } from "react-icons/ai";
import { BiLogIn } from "react-icons/bi";
import { Session } from "next-auth";
import Logout from "@/components/Logout";
import Orders from "./Orders";
import { ShoppingOrder } from "@/lib/db/order";
import { DeliveryProps } from "@/lib/db/delivery";
import UserInfo from "./Info";

interface MenuProps {
  session: Session | null;
  order: ShoppingOrder | null;
  delivery: DeliveryProps | null;
}

export default function Menu({ session, order, delivery }: MenuProps) {
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

          <div className="flex flex-col gap-2 w-72 text-zinc-500">
            <div
              onClick={() => handleMenuItemClick("orders")}
              className={`cursor-pointer flex items-center gap-4 p-4 pl-0 border-b-2 border-zinc-800 ${
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
              className={`cursor-pointer flex items-center gap-4 p-4 pl-0 border-b-2 border-zinc-800 ${
                selectedMenuItem === "userInfo" ? "text-white" : ""
              }`}
            >
              <span>
                <AiFillFileText size={24} />
              </span>
              <p>mes informations</p>
            </div>
            <div
              className={`cursor-pointer flex items-center gap-4 p-4 pl-0 border-b-2 border-zinc-800`}
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
        <UserInfo delivery={delivery} session={session} />
      )}
    </>
  );
}
