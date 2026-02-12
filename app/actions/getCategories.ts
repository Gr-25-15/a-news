"use server";

import prisma from "@/lib/prisma";

export type CategoryLink = {
  title: string;
  href: string;
  subCategories?: CategoryLink[];
};

export async function getCategoryLinks(): Promise<CategoryLink[]> {
  const categories = await prisma.category.findMany();
  return categories.map((category) => ({
    title: category.name,
    href: `/categories/${encodeURIComponent(category.name.toLowerCase())}`,
    subCategories: [], // TODO: Fetch subcategories when they are implemented
  }));
}
