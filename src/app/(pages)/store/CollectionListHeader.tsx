import { AiOutlineSearch } from "react-icons/ai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Search from "@/components/Search";
import { ChangeEvent } from "react";

interface ProductListHeaderProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  productsCount: number;
  selectedSort: string;
  onSortAlphabetically: () => void;
  onSortReverseAlphabetically: () => void;
}

export default function ProductListHeader({
  searchTerm,
  onSearchChange,
  productsCount,
  selectedSort,
  onSortAlphabetically,
  onSortReverseAlphabetically,
}: ProductListHeaderProps) {
  return (
    <div className="mb-4 w-full flex flex-col md:flex-row gap-y-4 md:gap-0 md:justify-between items-start relative">
      <div className="md:hidden w-full space-y-2 relative">
        <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
      </div>

      <div className="font-bold">
        Produits : <span>{productsCount}</span>
      </div>

      <div className="hidden md:block">
        <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
      </div>
      <Accordion className="-mt-4 w-[10rem]" type="single" collapsible>
        <AccordionItem value="item-1" className="relative">
          <AccordionTrigger className="text-sm md:text-base font-Noto">
            Trier
          </AccordionTrigger>
          <AccordionContent>
            <p
              className={`text-sm cursor-pointer ${
                selectedSort === "A-Z" ? "text-secondary" : "text-white"
              }`}
              onClick={onSortAlphabetically}
            >
              Ordre A-Z
            </p>
          </AccordionContent>
          <AccordionContent>
            <p
              className={`text-sm cursor-pointer ${
                selectedSort === "Z-A" ? "text-secondary" : "text-white"
              }`}
              onClick={onSortReverseAlphabetically}
            >
              Ordre Z-A
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
