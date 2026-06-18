import { generateWithGemini, AUTOMATION_AGENT_SYSTEM_PROMPT } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function checkLowStockAlerts() {
  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { brand: true },
  });
  const lowStockProducts = allProducts.filter((p) => p.stock <= p.minStock);

  if (lowStockProducts.length === 0) {
    return { alerts: [], message: "Todos los productos tienen stock suficiente." };
  }

  const prompt = `Genera alertas de reabastecimiento para los siguientes productos con stock bajo:
${lowStockProducts.map((p) => `- ${p.name} (${p.brand.name}): Stock actual=${p.stock}, Stock mínimo=${p.minStock}`).join("\n")}

Para cada producto, recomienda:
1. Cantidad sugerida a pedir
2. Urgencia (ALTA/MEDIA/BAJA)
3. Proveedor potencial`;

  const analysis = await generateWithGemini(prompt, AUTOMATION_AGENT_SYSTEM_PROMPT);

  return {
    alerts: lowStockProducts.map((p) => ({
      productId: p.id,
      productName: p.name,
      currentStock: p.stock,
      minStock: p.minStock,
      urgency: p.stock === 0 ? "ALTA" : p.stock <= p.minStock / 2 ? "ALTA" : "MEDIA",
    })),
    analysis,
    timestamp: new Date().toISOString(),
  };
}

export async function analyzeSalesPatterns() {
  const recentOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      status: { not: "CANCELLED" },
    },
    include: {
      items: { include: { product: { include: { brand: true } } } },
    },
  });

  if (recentOrders.length === 0) {
    return { message: "No hay datos de ventas recientes para analizar." };
  }

  const brandSales = new Map<string, number>();
  const productSales = new Map<string, number>();

  for (const order of recentOrders) {
    for (const item of order.items) {
      const brandName = item.product.brand.name;
      brandSales.set(brandName, (brandSales.get(brandName) || 0) + item.quantity);
      productSales.set(item.product.name, (productSales.get(item.product.name) || 0) + item.quantity);
    }
  }

  const prompt = `Analiza los siguientes patrones de venta de la última semana:

Ventas por marca:
${Array.from(brandSales.entries()).map(([brand, qty]) => `- ${brand}: ${qty} unidades`).join("\n")}

Productos más vendidos:
${Array.from(productSales.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, qty], i) => `  ${i + 1}. ${name}: ${qty} unidades`).join("\n")}

Total de órdenes: ${recentOrders.length}

Genera:
1. Análisis de tendencias de compra
2. Recomendaciones de promociones basadas en los datos
3. Sugerencias de cross-selling (productos que se venden juntos)
4. Estrategias de precios para la próxima semana`;

  return generateWithGemini(prompt, AUTOMATION_AGENT_SYSTEM_PROMPT);
}

export async function generateAutomatedRestockOrder() {
  const lowStockAlerts = await checkLowStockAlerts();

  if (lowStockAlerts.alerts.length === 0) {
    return null;
  }

  const prompt = `Basado en las siguientes alertas de stock bajo, genera una orden de reabastecimiento recomendada:

${lowStockAlerts.alerts.map((a) => `- ${a.productName}: Stock=${a.currentStock}, Mínimo=${a.minStock}, Urgencia=${a.urgency}`).join("\n")}

Para cada producto, sugiere:
- Cantidad a ordenar (basado en ventas históricas estimadas)
- Prioridad (1-5, donde 1 es máxima prioridad)
- Costo estimado total

Formato: JSON array con {productName, suggestedQuantity, priority, estimatedCost}`;

  const analysis = await generateWithGemini(prompt, AUTOMATION_AGENT_SYSTEM_PROMPT);

  return {
    alerts: lowStockAlerts.alerts,
    restockRecommendation: analysis,
    generatedAt: new Date().toISOString(),
  };
}
