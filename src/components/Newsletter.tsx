"use client";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import styles from "@/styles/Utils.module.css";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { BsCaretLeftFill } from "react-icons/bs";
import Link from "next/link";
import { motion } from "framer-motion";

//Account
export const NewsletterFormSchema = z.object({
  email: z
    .string({
      required_error: "L'adresse e-mail est requise",
      invalid_type_error: "L'adresse e-mail doit être une chaîne de caractères",
    })
    .max(250)
    .email({
      message: "Adresse e-mail invalide",
    }),
});

export type NewsletterFormValues = z.infer<typeof NewsletterFormSchema>;
export const defaultNewsletterFormValues: Partial<NewsletterFormValues> = {};

export default function Newsletter() {
  const [showForm, setShowForm] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(NewsletterFormSchema),
    defaultValues: defaultNewsletterFormValues,
  });

  const newsletter = async (data: NewsletterFormValues) => {
    try {
      if (!checkboxChecked) {
        setError("Vous devez accepter les termes et conditions.");
        return;
      }
      const formData = new FormData();
      formData.append("email", data.email);

      toast.success("Inscription à la newsletter avec succcès");
      setError("");
      setShowForm(!showForm);
      setCheckboxChecked(!checkboxChecked);
      form.reset();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'envoie de l'email : ",
        error
      );
      return error;
    }
  };

  const handleShowForm = useCallback(() => {
    setShowForm(!showForm);
  }, [showForm]);

  const handleClickCheckbox = useCallback(() => {
    setCheckboxChecked(!checkboxChecked);
  }, [checkboxChecked]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="fixed right-0 bottom-24 flex border-b p-4 md:p-3 md:space-x-8 space-y-4"
    >
      {showForm ? (
        <div className="w-[30rem] bg-primary flex space-x-8 p-4">
          <div className="w-full space-y-4">
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={handleShowForm}
            >
              <h2 className="text-2xl font-Noto">Newsletter</h2>
              <p>
                <BsCaretLeftFill
                  size={15}
                  className={`ml-2 ${showForm ? `${styles.rotate}` : ""} : ""}`}
                />
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(newsletter)}
                className="w-full flex flex-col space-y-4"
              >
                {error ? <small className="text-red-500">{error}</small> : null}
                {/* email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="items-top flex space-x-2">
                  <Checkbox id="terms1" onClick={handleClickCheckbox} />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <Link href={"/politique-de-confidentialite"}>
                        Accepter les termes et conditions
                      </Link>
                    </label>
                  </div>
                </div>
                <div className="py-4">
                  <Button size="lg">S&apos;abonner</Button>
                </div>
              </form>
            </Form>{" "}
          </div>
        </div>
      ) : (
        <button onClick={handleShowForm} className="flex gap-4 items-center">
          <BsCaretLeftFill
            size={15}
            className={`ml-2 ${showForm ? `${styles.rotate}` : ""} : ""}`}
          />
          Newsletter
        </button>
      )}
    </motion.div>
  );
}
