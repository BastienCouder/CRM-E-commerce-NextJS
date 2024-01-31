"use client";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handleOrderCreation } from "../../../actions/pages/create-validate-order";
import { checkForExistingStripeSession } from "@/app/actions/pages/checking-session";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session_id = searchParams.get("session_id");
  const processedSessionId = useRef<any>(null);

  useEffect(() => {
    async function processPayment() {
      if (session_id && session_id !== processedSessionId.current) {
        const sessionExists = await checkForExistingStripeSession(session_id);
        if (!sessionExists) {
          router.push("/cart");
          return;
        }
        await handleOrderCreation(session_id);
        processedSessionId.current = session_id;
      }
    }

    processPayment();
  }, [session_id, router]);

  return (
    <>
      <h1>Paiement réussi</h1>
      <p>Votre commande est en cours de traitement.</p>
    </>
  );
}
