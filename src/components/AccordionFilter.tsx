import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RxCross2 } from "react-icons/rx";
import { Category } from "@prisma/client";

interface AccordionFilterProps {
  title: string;
  items: { id: string; name: string | null }[];
  selectedItem: { id: string; name: string | null } | null;
  onItemClick: (category: Category) => void;
  onReset: () => void;
}

export default function AccordionFilter({
  title,
  items,
  selectedItem,
  onItemClick,
  onReset,
}: AccordionFilterProps) {
  return (
    <div className="flex w-full relative">
      <Accordion className="flex w-full relative" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-Noto">{title}</AccordionTrigger>
          <ul className="w-full">
            {items.map((item) => {
              return (
                <li key={item.id}>
                  <AccordionContent
                    onClick={() => onItemClick(item)}
                    className="cursor-pointer"
                  >
                    <div
                      className={`text-xs font-Noto text-start uppercase ${
                        selectedItem?.id === item.id
                          ? "text-secondary"
                          : "text-white"
                      }`}
                    >
                      {item.name}
                    </div>
                  </AccordionContent>
                </li>
              );
            })}
          </ul>
        </AccordionItem>
      </Accordion>
      {selectedItem && (
        <div
          onClick={onReset}
          className="absolute top-5 right-6 cursor-pointer"
        >
          <RxCross2 size={15} />
        </div>
      )}
    </div>
  );
}
