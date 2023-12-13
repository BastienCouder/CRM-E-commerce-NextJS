// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/components/ui/use-toast";
// import { Button } from "@/components/ui/button";
// import { ProductProps } from "../../lib/db/product";
// import { Category, ProductVariant } from "@prisma/client";
// import { Separator } from "@/components/ui/separator";
// import formatPrice from "@/lib/format";
// import Image from "next/image";
// import { productSchema } from "../../lib/zod";

// type CreateProductValues = z.infer<typeof  productSchema>;

// interface  CreateProductProps{

// }

//   export default function CreateProduct({

//   }: CreateProductProps) {
//     const { toast } = useToast();
//     const defaultValues: Partial<CreateProductValues> = {

//     };
//     const form = useForm<CreateProductValues>({
//       resolver: zodResolver(productSchema),
//       defaultValues,
//       mode: "onChange",
//     });

//   const onSubmit = async (data: CreateProductValues) => {
//     try {
//       const formData = new FormData();

//       await CreateProduct(, formData);

//       toast({
//         title: "You submitted the following values:",
//         description: (
//           <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//           </pre>
//         ),
//       });
//     } catch (error) {
//       console.error("Error submitting values:", error);
//     }

//   return (
//     <>
//       <Separator />
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Nom du produit</FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Separator />
//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Description du produit</FormLabel>
//                 <FormControl>
//                   <Textarea className="resize-none" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Separator />
//           <FormField
//             control={form.control}
//             name="category"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Categorie du produit</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder={product.category?.name} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {categories.map((category) => (
//                       <SelectItem key={category.id} value={category.name!}>
//                         {category.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormDescription>Choisissez une catégorie.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Separator />
//           <FormField
//             control={form.control}
//             name="imageUrl"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Image du produit</FormLabel>
//                 <div className="flex space-x-4 w-full justify-between">
//                   <div className="w-full space-y-2 text-sm">
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <p>Définisez l&apos;image de votre produit.</p>
//                   </div>
//                   <FormDescription>
//                     <Image
//                       className="rounded-lg w-[150px] h-[150px] object-contain"
//                       src={field.value}
//                       alt={product.name}
//                       width={500}
//                       height={500}
//                     />
//                   </FormDescription>
//                 </div>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Separator />
//           <FormField
//             control={form.control}
//             name="stock"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Stock</FormLabel>
//                 <FormControl>
//                   <Input type="number" {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   Mettre à 0 pour rendre le produit en rupture de stock.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Separator />
//           <FormField
//             control={form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Prix</FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   Valeur monétaire : {formatPrice(Number(field.value), "EUR")}
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button variant="outline" type="submit" size="xl">
//             Modifier le produit
//           </Button>
//         </form>
//       </Form>
//     </>
//   );
// }
