import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminProductsClient } from "./AdminProductsClient";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { brand: true, category: true },
    orderBy: { name: "asc" },
  });

  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return <AdminProductsClient products={products} brands={brands} categories={categories} />;
}
