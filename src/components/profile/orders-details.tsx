"use client";
import { OrderProps } from "@/lib/db/order";
import formatPrice, { formatDate, formatDescription } from "../../../format";
import { handleStatusChange } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AiFillCreditCard, AiOutlineUser } from "react-icons/ai";
import { BiTimeFive } from "react-icons/bi";
import { CartItem, OrderItem } from "@/schemas/DbSchema";
import { ScrollArea } from "../ui/scroll-area";

interface OrdersProps {
  order: OrderProps;
}

export default function Orders({ order }: OrdersProps) {
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number | null>(
    null
  );

  return (
    <ScrollArea className="h-[80vh] px-4">
      <ul className="space-y-8">
        {order?.orderItems?.map((orderItem: OrderItem, index: number) => {
          const dateValue = new Date(orderItem.createdAt!);
          const formattedDate = formatDate(dateValue);
          const isOrderSelected = selectedOrderIndex === index;

          return (
            <li key={index} className="w-[40rem] border-[1px] border-white">
              {!isOrderSelected ? (
                <>
                  <div className="flex items-center h-10 px-4 py-2 w-full bg-primary">
                    <p className="font-bold uppercase text-sm">
                      Commande n°{orderItem.orderNumber}
                    </p>
                  </div>
                  <div className="space-y-4 p-4">
                    <div className="flex items-center gap-3">
                      <BiTimeFive size={20} />
                      <div className="flex gap-2">
                        <p>Date de la commande :</p>
                        <p className="font-bold">{formattedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MoreHorizontal size={20} />
                      <div className="flex gap-2">
                        <p>Status de la commande :</p>
                        <p
                          className={`border px-1 ${
                            orderItem.status === "delivered"
                              ? "border-green-800"
                              : orderItem.status === "in progress"
                              ? "border-blue-800"
                              : orderItem.status === "waiting"
                              ? "border-amber-700"
                              : "border-destructive"
                          }`}
                        >
                          {handleStatusChange(orderItem.status!)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AiOutlineUser size={20} />
                      <div className="flex gap-2">
                        <p>Envoyé à </p>
                        <div className="flex gap-2 font-bold">
                          {orderItem.deliveryItems && (
                            <div className="space-x-2 capitalize">
                              <span>{orderItem.deliveryItems.name}</span>
                              <span className="uppercase">
                                {orderItem.deliveryItems.surname}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AiFillCreditCard size={20} />
                      {formatPrice(orderItem.subtotal, "EUR")}
                    </div>
                  </div>
                  <div className="px-4 pb-4 w-32">
                    <p
                      onClick={() => {
                        if (isOrderSelected) {
                          setSelectedOrderIndex(null);
                        } else {
                          setSelectedOrderIndex(index);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      Voir le détail
                    </p>
                  </div>
                </>
              ) : null}

              {isOrderSelected && (
                <div>
                  <div className="flex flex-col justify-center h-20 gap-1 px-4 py-2 w-full bg-primary">
                    <p className="font-bold uppercase text-sm">
                      Commande n°{orderItem.orderNumber}
                    </p>
                    <p className="text-sm">
                      Date de la commande:{" "}
                      <span className="font-bold">{formattedDate}</span>
                    </p>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg pb-2">Status de la commande</h2>
                    <div className="text-sm border-b-2 pb-8 space-y-2 border-primary">
                      <div className="font-bold flex space-x-2">
                        <p
                          className={`border p-1 ${
                            orderItem.status === "delivered"
                              ? "border-green-800"
                              : orderItem.status === "in progress"
                              ? "border-blue-800"
                              : orderItem.status === "waiting"
                              ? "border-amber-700"
                              : "border-destructive"
                          }`}
                        >
                          {handleStatusChange(orderItem.status!)}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold">
                          {orderItem.deliveryOption.name}
                        </p>
                        <p>
                          {orderItem.deliveryOption.description &&
                            orderItem.deliveryOption.description}
                        </p>
                      </div>
                    </div>

                    <h2 className="text-lg mt-8 pb-2">Adresse de livraison</h2>
                    {isOrderSelected && orderItem.deliveryItems && (
                      <div className="text-sm border-b-2 pb-8 border-primary">
                        <div className="font-bold capitalize flex space-x-2">
                          <p>{orderItem.deliveryItems.name}</p>
                          <p>{orderItem.deliveryItems.surname}</p>
                        </div>
                        <p className="uppercase">
                          {orderItem.deliveryItems.address}
                        </p>
                        <div className="flex">
                          <p className="flex gap-2">
                            <span className="uppercase">
                              {orderItem.deliveryItems.city},
                              {orderItem.deliveryItems.postcode},
                            </span>
                            {orderItem.deliveryItems.country}
                          </p>
                        </div>
                        <p>{orderItem.deliveryItems.tel}</p>
                      </div>
                    )}

                    <div className=" border-b-2 border-zinc-800">
                      <h2 className="text-lg mt-8 pb-2">Votre commande</h2>
                      {isOrderSelected &&
                        orderItem.cart.cartItems.map(
                          (cartItems: CartItem, itemIndex: number) => {
                            const description = `${cartItems.product.description}`;
                            const formattedDescription =
                              formatDescription(description);
                            return (
                              <>
                                <div
                                  key={itemIndex}
                                  className="flex flex-row-reverse justify-end gap-4 text-sm pb-8"
                                >
                                  <div className="flex w-full">
                                    <Image
                                      src={cartItems.product.imageUrl}
                                      alt={cartItems.product.name}
                                      width={400}
                                      height={400}
                                      className="rounded-lg w-[90px] h-[90px] object-contain"
                                    />
                                  </div>
                                  <div className="flex flex-col space-y-1">
                                    <p className="font-bold flex items-center gap-2">
                                      {cartItems.product.name}

                                      {cartItems.variant && (
                                        <>
                                          <span>-</span>
                                          <span className="text-sm">
                                            {cartItems.variant.name}
                                          </span>
                                        </>
                                      )}
                                    </p>
                                    <p className="w-full text-sm">
                                      {formattedDescription}
                                    </p>
                                    <p className="uppercase">
                                      {formatPrice(
                                        cartItems.product.price,
                                        "EUR"
                                      )}
                                    </p>
                                    <p className="capitalize flex gap-2">
                                      {cartItems.quantity > 1
                                        ? `quantités`
                                        : `quantité`}
                                      <span>{cartItems.quantity}</span>
                                    </p>
                                  </div>
                                </div>
                              </>
                            );
                          }
                        )}
                    </div>
                    <div className="flex flex-col gap-4 text-sm border-b-2 pb-8 border-zinc-800">
                      <h2 className="text-lg mt-8 pb-2">
                        Total de votre commande
                      </h2>
                      <div className="flex justify-between w-72">
                        <p>Prix total de la commande :</p>
                        {formatPrice(orderItem.cart.subtotal, "EUR")}
                      </div>
                      <div className="flex justify-between w-72">
                        <p>Prix de la livraison :</p>
                        {formatPrice(orderItem.deliveryOption.price, "EUR")}
                      </div>
                      <div className="flex justify-between w-72">
                        <p>Prix total :</p>
                        {formatPrice(orderItem.subtotal, "EUR")}
                      </div>
                    </div>
                    <div className="mt-8 pb-4">
                      <p
                        onClick={() => {
                          if (isOrderSelected) {
                            setSelectedOrderIndex(null);
                          } else {
                            setSelectedOrderIndex(index);
                          }
                        }}
                        className="cursor-pointer"
                      >
                        Fermer le détail
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
