"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/helpers/format";
import Image from "next/image";
import { ProductProps } from "@/lib/db/product";
import { Category } from "@/lib/DbSchema";

export const productsFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  imageUrl: z.string({
    required_error: "Please select an email to display.",
  }),
  category: z.string({
    required_error: "Please select an email to display.",
  }),
  description: z.string().max(160).min(4),
  stock: z.string().refine((value) => !isNaN(Number(value)), {
    message: "Stock must be a number",
  }),
  price: z.string().refine((value) => !isNaN(Number(value)), {
    message: "Price must be a number",
  }),
});

type ProductsFormValues = z.infer<typeof productsFormSchema>;

interface ProductInformationsFormProps {
  product: ProductProps;
  categories: Category[];
  UpdateProduct: (
    productId: string,
    formData: FormData
  ) => Promise<{
    name: string;
    description: string;
    imageUrl: string;
    categoryId: string | null;
    stock: number | null;
  } | null>;
}

export default function ProductInformationsForm({
  product,
  categories,
  UpdateProduct,
}: ProductInformationsFormProps) {
  const { toast } = useToast();
  const defaultValues: Partial<ProductsFormValues> = {
    name: product.name,
    description: product.description,
    imageUrl: product.imageUrl,
    category: product.category?.name!,
    stock: product.stock?.toString(),
    price: product.price.toString(),
  };
  const form = useForm<ProductsFormValues>({
    resolver: zodResolver(productsFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: ProductsFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("imageUrl", data.imageUrl);
      formData.append("category", data.category);
      formData.append("description", data.description);
      formData.append("price", data.price);
      if (data.stock !== undefined) {
        formData.append("stock", data.stock);
      }
      await UpdateProduct(product.id, formData);

      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (error) {
      console.error("Error submitting values:", error);
    }
  };

  return (
    <>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du produit</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description du produit</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categorie du produit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={product.category} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category!}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Choisissez une catégorie.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image du produit</FormLabel>
                <div className="flex space-x-4 w-full justify-between">
                  <div className="w-full space-y-2 text-sm">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <p>Définisez l&apos;image de votre produit.</p>
                  </div>
                  <FormDescription>
                    <Image
                      className="rounded-lg w-[150px] h-[150px] object-contain"
                      src={field.value}
                      alt={product.name}
                      width={500}
                      height={500}
                    />
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Mettre à 0 pour rendre le produit en rupture de stock.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Valeur monétaire : {formatPrice(Number(field.value), "EUR")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="outline" type="submit" size="xl">
            Modifier le produit
          </Button>
        </form>
      </Form>
    </>
  );
}
