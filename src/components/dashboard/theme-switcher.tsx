"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ColorCircles from "./color-circles";
import { Palette } from "lucide-react";

export function ThemeSwitcher() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-5/6 flex gap-x-4 items-center">
            Theme
            <Palette size={20} color={"rgb(var(--primary))"} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Theme de couleurs</DialogTitle>
          </DialogHeader>
          <ColorCircles />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-5/6">
          Theme
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DialogHeader>
          <DialogTitle>Theme de couleurs</DialogTitle>
        </DialogHeader>
        <ColorCircles />
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}
