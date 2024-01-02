"use client";
import { useState, useEffect } from "react";
import { getLocalStorage } from "@/lib/helpers/storageHelper";

export function useDeliveryOptionId() {
  const [deliveryOptionId, setDeliveryOptionId] = useState<string | null>(null);

  useEffect(() => {
    const id = getLocalStorage("selectedDeliveryOption", null);
    setDeliveryOptionId(id);
  }, []);

  return deliveryOptionId;
}
