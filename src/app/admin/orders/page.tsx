import { prisma } from "@/lib/prisma";
import { AdminOrdersClient } from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true } },
      invoice: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return <AdminOrdersClient orders={orders} />;
}
