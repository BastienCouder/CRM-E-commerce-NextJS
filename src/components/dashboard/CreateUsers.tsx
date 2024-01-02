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
  FormDescription,
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
import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { UserRoleEnum } from "@/schemas/DbSchema";
import { z } from "zod";
import { checkIfEmailExists } from "@/lib/helpers/authHelper";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendCreateUser } from "@/app/dashboard/management/action/create-user";

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
  const UserSchema = z.object({
    email: z
      .string({
        required_error: "Un email est requis",
        invalid_type_error: "L'email doit être une chaîne de caractères",
      })
      .email({
        message: "Adresse e-mail invalide",
      })
      .refine(
        async (email) => {
          const existingUser = await checkIfEmailExists(email);
          return !existingUser;
        },
        {
          message: "L'e-mail n'existe pas",
        }
      ),
    username: z
      .string({
        required_error: "Le nom d'utilisateur est requis",
        invalid_type_error:
          "Le nom d'utilisateur doit être une chaîne de caractères",
      })
      .min(3, {
        message: "Le nom d'utilisateur doit comporter au moins 3 caractères",
      })
      .max(50),
    role: z.string({
      required_error: "Le role est requis",
      invalid_type_error: "Le role doit être une chaîne de caractères",
    }),
  });

  type UserValues = z.infer<typeof UserSchema>;
  const defaultUserValues: Partial<UserValues> = {};
  const formResolver = zodResolver(UserSchema);
  const form = useForm<UserValues>({
    resolver: formResolver,
    defaultValues: defaultUserValues,
  });

  const onSubmit = async (data: UserValues) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("role", data.role);

      try {
        await sendCreateUser(formData);
        toast.success(
          "E-mail de réinitialisation de mot de passe envoyé avec succès"
        );
        form.reset();
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Une erreur s'est produite");
        }
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la connexion : ", error);
      throw error;
    }
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
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
        </div>
        <Button
          variant="outline"
          onClick={() => {}}
          className="h-8 px-2 lg:px-3"
          type="submit"
        >
          Sauvegarder
        </Button>
      </form>
    </Form>
  );
}
