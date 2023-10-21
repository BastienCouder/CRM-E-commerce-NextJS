import FormSubmitButton from "@/components/FormSubmitButton";
import { prisma } from "@/lib/db/prisma";
import { Category } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { checkAdminRole } from "@/lib/admin";
import Input from "@/components/Input";

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
      <div>
        <h1 className="text-lg mb-3">Add Product</h1>
        <form action={addProduct} className="space-y-4 w-[40rem]">
          <div className="flex space-x-4">
            <Input
              label="Name"
              required={true}
              id="name"
              type="text"
              name="name"
              placeholder="Name"
            />
            <Input
              required={true}
              label="Price"
              id="price"
              type="number"
              name="price"
              placeholder="Price"
            />
          </div>

          <Input
            required={true}
            label="ImageUrl"
            id="imageUrl"
            type="url"
            name="imageUrl"
            placeholder="Image Url"
          />
          <input
            type="file"
            name="imageUrl"
            className="file-input w-full max-w-xs"
          />
          <select
            name="category"
            className="p-1 my-4 outline-none w-full text-white"
          >
            {categories.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="space-y-1">
            <label htmlFor="textarea">
              Description
              <span className="-mt-1 ml-1">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Description"
              className="w-full "
            ></textarea>
          </div>
          <FormSubmitButton>Add Product</FormSubmitButton>
        </form>
      </div>
    </>
  );
}
