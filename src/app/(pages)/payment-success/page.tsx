"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handleOrderCreation } from "../actions/create-validate-order";
import { checkForExistingStripeSession } from "../actions/checking-session";

export default function PaymentSuccess() {
  const [isProcessed, setIsProcessed] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const session_id = searchParams.get("session_id");

  useEffect(() => {
    async function processPayment() {
      if (session_id && !isProcessed) {
        const sessionExists = await checkForExistingStripeSession(session_id);
        if (!sessionExists) {
          router.push("/cart");
          return;
        }
        await handleOrderCreation(session_id);
        setIsProcessed(true);
      }
    }

    processPayment();
  }, [session_id, isProcessed, router]);

  return (
    <div>
      <h1>Paiement réussi</h1>
      <p>Votre commande est en cours de traitement.</p>
    </div>
  );
}
