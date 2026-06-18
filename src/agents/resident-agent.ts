import { generateWithGemini, RESIDENT_AGENT_SYSTEM_PROMPT } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function getInventorySummary() {
  const products = await prisma.product.findMany({
    include: { brand: true, category: true },
    orderBy: { stock: "asc" },
  });

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + Number(p.price) * p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= p.minStock);
  const outOfStock = products.filter((p) => p.stock === 0);
  const brands = [...new Set(products.map((p) => p.brand.name))];

  return {
    totalProducts,
    totalStock,
    totalValue,
    lowStockCount: lowStock.length,
    lowStock,
    outOfStockCount: outOfStock.length,
    outOfStock,
    brands,
    products: products.slice(0, 20),
  };
}

export async function getSalesSummary(days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: since },
      status: { not: "CANCELLED" },
    },
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalSales = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const topProducts = new Map<string, { name: string; quantity: number; revenue: number }>();

  for (const order of orders) {
    for (const item of order.items) {
      const existing = topProducts.get(item.product.name) || {
        name: item.product.name,
        quantity: 0,
        revenue: 0,
      };
      existing.quantity += item.quantity;
      existing.revenue += Number(item.subtotal);
      topProducts.set(item.product.name, existing);
    }
  }

  return {
    totalSales,
    totalRevenue,
    averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0,
    topProducts: Array.from(topProducts.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10),
    orders: orders.slice(0, 20),
  };
}

export async function askResidentAgent(question: string) {
  const inventory = await getInventorySummary();
  const sales = await getSalesSummary(30);

  const contextData = `
DATOS ACTUALES DEL SISTEMA:

=== INVENTARIO ===
Total de productos: ${inventory.totalProducts}
Stock total: ${inventory.totalStock}
Valor total del inventario: S/. ${inventory.totalValue.toFixed(2)}
Productos con stock bajo: ${inventory.lowStockCount}
Productos agotados: ${inventory.outOfStockCount}
Marcas disponibles: ${inventory.brands.join(", ")}

Productos con stock bajo:
${inventory.lowStock.map((p) => `- ${p.name} (${p.brand.name}): ${p.stock} unidades (mínimo: ${p.minStock})`).join("\n")}

=== VENTAS (últimos 30 días) ===
Total de ventas: ${sales.totalSales}
Ingresos totales: S/. ${sales.totalRevenue.toFixed(2)}
Valor promedio por orden: S/. ${sales.averageOrderValue.toFixed(2)}

Productos más vendidos:
${sales.topProducts.map((p, i) => `  ${i + 1}. ${p.name}: ${p.quantity} unidades (S/. ${p.revenue.toFixed(2)})`).join("\n")}
`;

  const prompt = `${contextData}\n\nPREGUNTA DEL USUARIO:\n${question}\n\nProporciona un análisis detallado y recomendaciones accionables.`;

  return generateWithGemini(prompt, RESIDENT_AGENT_SYSTEM_PROMPT);
}

export async function generateWeeklyReport() {
  const inventory = await getInventorySummary();
  const sales = await getSalesSummary(7);

  const prompt = `Genera un reporte semanal ejecutivo para Leandro Baterías con los siguientes datos:

Inventario actual:
- Total productos: ${inventory.totalProducts}
- Stock total: ${inventory.totalStock}
- Valor inventario: S/. ${inventory.totalValue.toFixed(2)}
- Productos críticos (bajo stock): ${inventory.lowStockCount}
- Productos agotados: ${inventory.outOfStockCount}

Ventas de la semana:
- Órdenes: ${sales.totalSales}
- Ingresos: S/. ${sales.totalRevenue.toFixed(2)}
- Ticket promedio: S/. ${sales.averageOrderValue.toFixed(2)}
- Top productos: ${sales.topProducts.map((p) => p.name).join(", ")}

Por favor genera:
1. Resumen ejecutivo
2. Análisis de inventario (qué comprar urgentemente)
3. Análisis de ventas (tendencias)
4. Recomendaciones de acción
5. Predicciones para la próxima semana`;

  return generateWithGemini(prompt, RESIDENT_AGENT_SYSTEM_PROMPT);
}
