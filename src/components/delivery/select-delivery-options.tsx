import { Dictionary } from "@/lang/dictionaries";
import formatPrice from "../../lib/helpers/format";
import { DeliveryOption } from "@/schemas/db-schema";

interface SelectDeliveryOptions {
  handleDeliveryOptionsChange: (id: string) => void;
  selectedDeliveryOption: string;
  deliveryOptions: DeliveryOption[];
  dict: Dictionary;
}

export default function SelectDeliveryOptions({
  deliveryOptions,
  selectedDeliveryOption,
  handleDeliveryOptionsChange,
  dict,
}: SelectDeliveryOptions) {
  return (
    <>
      <ul className="space-y-4 w-[30rem]">
        {deliveryOptions.map((deliveryOption) => (
          <li
            key={deliveryOption.id}
            className="flex text-sm border-2 px-8 py-6 border-white"
          >
            <div className="w-60">
              <div className="flex flex-col font-bold">
                <p className="capitalize">{deliveryOption.name}</p>
              </div>
              <p className="uppercase">{deliveryOption.description}</p>
              <p>{formatPrice(deliveryOption.price, dict.locale)}</p>
            </div>
            <div className="pl-12">
              <div
                onClick={() => handleDeliveryOptionsChange(deliveryOption.id)}
                className={`mb-2 h-4 w-4 border-2 border-secondary cursor-pointer ${
                  selectedDeliveryOption === deliveryOption.id
                    ? "bg-secondary"
                    : ""
                }`}
              ></div>
              {selectedDeliveryOption === deliveryOption.id && (
                <p>Option de livraison</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
