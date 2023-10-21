import FormSubmitButton from "@/components/FormSubmitButton";
import { prisma } from "@/lib/db/prisma";
import { Category } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { checkAdminRole } from "@/lib/admin";

export const metadata = {
  title: "Add Product - E-commerce",
  description: "Ceci est la page d'accueil de mon application.",
};

const getCategory = cache(async () => {
  const category = await prisma.category.findMany();
  if (!category) notFound();
  return category;
});

export default async function AddProductPage() {
  const session = await getServerSession(authOptions);
  const updatedSession = checkAdminRole(session);

  if (updatedSession && updatedSession.user.role !== "admin") {
    redirect("/");
  }

  const categories = await getCategory();

  async function addProduct(formData: FormData) {
    "use server";

    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const imageUrl = formData.get("imageUrl")?.toString();
    const price = Number(formData.get("price") || 0);
    const categoryId = formData.get("category")?.toString();

    if (!name || !description || !imageUrl || !categoryId || !price)
      throw Error("Des champs sont manquants");

    await prisma.products.create({
      data: { name, description, imageUrl, categoryId, price },
    });

    redirect("/");
  }

  return (
    <>
      <h1 className="text-lg mb-3">Add Product</h1>
      <form action={addProduct}>
        <input
          className="mb-3 w-full text-black"
          required
          type="text"
          name="name"
          placeholder="Name"
        />
        <textarea
          required
          name="description"
          className="mb-3 w-full text-black"
          placeholder="Description"
        ></textarea>
        <input
          className="mb-3 w-full text-black"
          required
          type="url"
          name="imageUrl"
          placeholder="Image Url"
        />
        <input
          className="mb-3 w-full text-black"
          required
          type="number"
          name="price"
          placeholder="Price"
        />
        <select name="category" className="mb-3 w-full text-white">
          {categories.map((category: Category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <FormSubmitButton className="">Add Product</FormSubmitButton>
      </form>
    </>
  );
}
