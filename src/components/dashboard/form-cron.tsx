"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import { daysOfWeek } from "./select-cron";
import { Button } from "@/components/ui/button";

interface FormCronProps {
  form: UseFormReturn<FieldValues, any, undefined>;
  frequency: string;
  onSubmit: SubmitHandler<FieldValues>;
}

export function FormCron({ form, frequency, onSubmit }: FormCronProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-4">
        <div className="space-y-2">
          {/* Jour du mois */}
          {frequency === "monthly" && (
            <FormField
              control={form.control}
              name="dayOfMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jour du mois</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Jour du mois" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-44">
                      <SelectGroup>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i} value={String(i)}>
                            {i}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* Hebdomadaire */}
          {frequency === "weekly" && (
            <FormField
              control={form.control}
              name="weekly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jour de la semaine</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={"MON"}
                          placeholder="Jour de la semaine"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {daysOfWeek.map((day, index) => (
                        <SelectItem key={index} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Heure */}
          <FormField
            control={form.control}
            name="hour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Heure" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Minute */}
          <FormField
            control={form.control}
            name="minute"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minute</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Minute" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Soumettre</Button>
      </form>
    </Form>
  );
}
