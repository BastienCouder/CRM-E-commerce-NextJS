"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
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
    case "biweekly":
    case "triweekly":
      return z.object({
        daysOfWeek: z.array(z.string()),
        hour: z.string().min(1).max(23),
        minute: z.string().min(1).max(59),
      });
    default:
      return z.object({});
  }
};

export const daysOfWeek = [
  { label: "Lundi", value: "MON" },
  { label: "Mardi", value: "TUE" },
  { label: "Mercredi", value: "WED" },
  { label: "Jeudi", value: "THU" },
  { label: "Vendredi", value: "FRI" },
  { label: "Samedi", value: "SAT" },
  { label: "Dimanche", value: "SUN" },
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

    try {
      const type = frequency;

      const savedConfig = await saveCronConfig(id, type, cronString);
      toast({
        title: "Configuration Cron enregistrée",
        description: `La configuration Cron a été enregistrée avec succès. ID : ${savedConfig.id}`,
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement de la configuration Cron :",
        error
      );
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
            <DialogTitle>Éditer la configuration</DialogTitle>
            <DialogDescription>
              Modifiez et sélectionnez l&apos;horaire. Cliquez sur Enregistrer
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
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="biweekly" />
              <Label htmlFor="biweekly">Deux fois par semaine</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="triweekly" />
              <Label htmlFor="triweekly">Trois fois par semaine</Label>
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
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="biweekly" />
          <Label htmlFor="biweekly">Deux fois par semaine</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="triweekly" />
          <Label htmlFor="triweekly">Trois fois par semaine</Label>
        </div>
      </RadioGroup>

      <FormCron form={form} frequency={frequency} onSubmit={onSubmit} />
    </>
  );
}
