import { prisma } from "@/lib/prisma";
import { AdminInventoryClient } from "./AdminInventoryClient";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { brand: true },
    orderBy: { stock: "asc" },
  });

  const movements = await prisma.inventoryMovement.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return <AdminInventoryClient products={JSON.parse(JSON.stringify(products))} movements={JSON.parse(JSON.stringify(movements))} />;
}
