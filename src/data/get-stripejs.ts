import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      `pk_test_51O15OBK2ubjGwrsgSXuzH5fwNRkl8NyWuiJgxLgiR7wAUI5pNEMQNn4rsL6qbKeTFto2vZvI7fDX2FAS9Z5LrY2F00fjKtwM36`
    );
  }
  return stripePromise;
};

export default getStripe;
