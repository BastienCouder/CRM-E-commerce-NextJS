import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Color } from "@/schemas/db-schema";
import { X } from "lucide-react";

interface AccordionFilterProps<T> {
  title: string;
  items: T[];
  selectedItem: T | null;
  onItemClick: (item: T) => void;
  onReset: () => void;
}

export default function AccordionFilter<T extends Color>({
  title,
  items,
  selectedItem,
  onItemClick,
  onReset,
}: AccordionFilterProps<T>) {
  return (
    <>
      <Accordion className="flex w-[10rem] relative" type="single" collapsible>
        <AccordionItem value="item-1" className="w-full">
          <AccordionTrigger>{title}</AccordionTrigger>
          <ul className="w-full">
            {items.map((item, index) => {
              return (
                <li key={index}>
                  <AccordionContent
                    onClick={() => onItemClick(item)}
                    className="cursor-pointer"
                  >
                    <div
                      className={`text-xs  text-start uppercase ${
                        selectedItem === item ? "text-secondary" : "text-white"
                      }`}
                    >
                      {item}
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
          <X size={15} />
        </div>
      )}
    </>
  );
}
