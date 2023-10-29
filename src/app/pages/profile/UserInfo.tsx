"use client";
import { DeliveryProps } from "@/lib/db/delivery";
import DeliveryInfo from "./components/DeliveryInfo";
import {
  DeleteDeliveryItem,
  UpdateDeliveryForm,
  setDefaultDeliveryItem,
} from "../cart/delivery/actions";
import { Session } from "next-auth";

interface UserInfoProps {
  session: Session | null;
  delivery: DeliveryProps | null;
}

export default function UserInfo({ session, delivery }: UserInfoProps) {
  return (
    <div>
      <DeliveryInfo
        delivery={delivery}
        setDefaultDeliveryItem={setDefaultDeliveryItem}
        DeleteDeliveryItem={DeleteDeliveryItem}
        UpdateDeliveryForm={UpdateDeliveryForm}
        session={session}
      />
    </div>
  );
}
