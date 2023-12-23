import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Category, Color } from "@/lib/DbSchema";
import { Cross } from "lucide-react";

interface AccordionFilterProps<T> {
  title: string;
  items: T[];
  selectedItem: T | null;
  onItemClick: (item: T) => void;
  onReset: () => void;
}

export default function AccordionFilter<T extends Category | Color>({
  title,
  items,
  selectedItem,
  onItemClick,
  onReset,
}: AccordionFilterProps<T>) {
  return (
    <div className="flex w-full relative">
      <Accordion className="flex w-full relative" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-Noto">{title}</AccordionTrigger>
          <ul className="w-full">
            {items.map((item) => {
              return (
                <li key={item}>
                  <AccordionContent
                    onClick={() => onItemClick(item)}
                    className="cursor-pointer"
                  >
                    <div
                      className={`text-xs font-Noto text-start uppercase ${
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
          <Cross size={15} />
        </div>
      )}
    </div>
  );
}
