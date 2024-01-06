"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { handleOrderCreation } from "../actions/create-session";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();

  const session_id = searchParams.get("session_id");

  useEffect(() => {
    const session = session_id;
    if (session) {
      handleOrderCreation(session);
    }
  }, [session_id]);

  return (
    <div>
      {/* UI pour un paiement réussi */}
      <h1>Paiement réussi</h1>
      <p>Votre commande est en cours de traitement.</p>
    </div>
  );
}
