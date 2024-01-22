"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { toast } from "../ui/use-toast";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { saveCronConfig } from "@/lib/data/save-conf-cron";
import { FormCron } from "./form-cron";

interface SelectCronProps {
  title: string;
  id: string;
}

const getSchema = (frequency: string) => {
  switch (frequency) {
    case "daily":
      return z.object({
        hour: z.string().min(1).max(23),
        minute: z.string().min(1).max(59),
      });
    case "weekly":
      return z.object({
        hour: z.string().min(1).max(23),
        minute: z.string().min(1).max(59),
        weekly: z.string().min(1),
      });
    case "monthly":
      return z.object({
        hour: z.string().min(1).max(23),
        minute: z.string().min(1).max(59),
        dayOfMonth: z.string().min(1).max(31),
      });
    default:
      return z.object({});
  }
};

export const daysOfWeek = [
  { label: "Monday", value: "MON" },
  { label: "Tuesday", value: "THU" },
  { label: "Wednesday", value: "WEd" },
  { label: "Thursday", value: "THU" },
  { label: "Friday", value: "FRI" },
  { label: "Saturday", value: "SAT" },
  { label: "Sunday", value: "SUN" },
];

export function SelectCron({ title, id }: SelectCronProps) {
  const [frequency, setFrequency] = useState("daily");

  const form = useForm({
    resolver: zodResolver(getSchema(frequency)),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    let cronString = "";
    switch (frequency) {
      case "daily":
        cronString = `${data.minute} ${data.hour} * * *`;
        break;
      case "weekly":
        if ("weekly" in data) {
          cronString = `${data.minute} ${data.hour} * * ${data.weekly}`;
        }
        break;
      case "monthly":
        if ("dayOfMonth" in data) {
          cronString = `${data.minute} ${data.hour} ${data.dayOfMonth} * *`;
        }
        break;
    }
    console.log(cronString);

    try {
      const type = frequency;

      const savedConfig = await saveCronConfig(id, type, cronString);
      toast({
        title: "Config Cron sauvegardée",
        description: `La configuration Cron a été sauvegardée avec succès. ID: ${savedConfig.id}`,
      });
    } catch (error) {
      console.error("Error saving cron config:", error);
    }
  };
  const handleFrequencyChange = (newFrequency: string) => {
    setFrequency(newFrequency);
  };

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">{title}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editer la configuration</DialogTitle>
            <DialogDescription>
              Modifier et sélectionner l&apos;horaire. Cliquez sur Enregistrer
              lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>

          <RadioGroup
            defaultValue="daily"
            onValueChange={handleFrequencyChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" />
              <Label htmlFor="r1">Quotidien</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" />
              <Label htmlFor="r2">Hebdomadaire</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" />
              <Label htmlFor="r3">Mensuel</Label>
            </div>
          </RadioGroup>
          <FormCron form={form} frequency={frequency} onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <RadioGroup defaultValue="daily" onValueChange={handleFrequencyChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="daily" />
          <Label htmlFor="r1">Quotidien</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="weekly" />
          <Label htmlFor="r2">Hebdomadaire</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="monthly" />
          <Label htmlFor="r3">Mensuel</Label>
        </div>
      </RadioGroup>

      <FormCron form={form} frequency={frequency} onSubmit={onSubmit} />
    </>
  );
}
