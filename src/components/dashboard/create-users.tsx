"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useState, useTransition } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { UserRoleEnum } from "@/schemas/db-schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterAdminSchema } from "@/schemas";
import { registerDashboard } from "@/app/actions/auth/register";
import { FormError } from "../auth/form-error";
import { FormSuccess } from "../auth/form-success";

export default function CreateUsers() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {}}
            className="h-8 px-2 lg:px-3"
          >
            Créer un utilisateur
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un utilisateur</DialogTitle>
            <DialogDescription>
              Créer un utilisateur ici. Cliquez sur enregistrer lorsque vous
              avez terminé
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {}}
          className="h-8 px-2 lg:px-3"
        >
          Créer un utilisateur
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Créer un utilisateur</DrawerTitle>
          <DrawerDescription>
            Créer un utilisateur ici. Cliquez sur enregistrer lorsque vous avez
            terminé
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  type RegisterAdminSchemaValues = z.infer<typeof RegisterAdminSchema>;
  const defaultRegisterAdminSchemaValues: Partial<RegisterAdminSchemaValues> =
    {};
  const formResolver = zodResolver(RegisterAdminSchema);
  const form = useForm<RegisterAdminSchemaValues>({
    resolver: formResolver,
    defaultValues: defaultRegisterAdminSchemaValues,
  });

  const onSubmit = (values: z.infer<typeof RegisterAdminSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      registerDashboard(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };
  const userRoles = UserRoleEnum.options;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid items-start gap-4", className)}
      >
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Mot de passe"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role utilisateur</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Role utilisateur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {userRoles.map((userRole, index) => (
                        <SelectItem key={index} value={userRole}>
                          {userRole}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
        </div>
        <Button
          variant="outline"
          onClick={() => {}}
          className="h-8 px-2 lg:px-3"
          type="submit"
          disabled={isPending}
        >
          Sauvegarder
        </Button>
      </form>
    </Form>
  );
}
