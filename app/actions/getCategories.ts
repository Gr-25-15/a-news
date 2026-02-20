"use server";

import prisma from "@/lib/prisma";

export type CategoryLink = {
  title: string;
  href: string;
  subCategories?: CategoryLink[];
};

export type Option = {
  label: string;
  value: string;
};

export async function getCategoryLinks(): Promise<CategoryLink[]> {
  const categories = await prisma.category.findMany();
  const categoryLinks = categories.map((category) => ({
    title: category.name,
    href: `/?category=${encodeURIComponent(category.name)}`,
    subCategories: [], // TODO: Fetch subcategories when they are implemented
  }));

  return [{ title: "All", href: "/" }, ...categoryLinks];
}

export async function getCategoryFormData(): Promise<Option[]> {
  const categories = await prisma.category.findMany();
  return categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
}
