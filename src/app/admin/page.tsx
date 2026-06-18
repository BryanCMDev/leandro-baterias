import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Package, ShoppingCart, TrendingUp, AlertTriangle, Warehouse, Bot } from "lucide-react";

async function getDashboardData() {
  const [totalProducts, totalStock, totalOrders, outOfStockCount, revenue, allActive, recentOrders] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.aggregate({ _sum: { stock: true } }),
    prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.product.count({ where: { stock: 0, isActive: true } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { brand: true },
      orderBy: { stock: "asc" },
    }),
    prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const lowStockProducts = allActive.filter((p) => p.stock <= p.minStock).slice(0, 10);

  return {
    totalProducts,
    totalStock: totalStock._sum.stock || 0,
    totalOrders,
    lowStockCount: lowStockProducts.length,
    outOfStockCount,
    totalRevenue: revenue._sum.total || 0,
    recentOrders,
    lowStockProducts,
  };
}

export default async function AdminPage() {
  const data = await getDashboardData();

  const cards = [
    { label: "Productos", value: data.totalProducts, icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Stock Total", value: data.totalStock, icon: Warehouse, color: "text-green-600 bg-green-50" },
    { label: "Órdenes", value: data.totalOrders, icon: ShoppingCart, color: "text-purple-600 bg-purple-50" },
    { label: "Stock Bajo", value: data.lowStockCount, icon: AlertTriangle, color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <div className="page-container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Panel de Administración</h1>
          <p className="text-secondary-500">Gestión de inventario y ventas</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/agent" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            <Bot className="w-4 h-4 mr-2" /> Agente IA
          </Link>
          <Link href="/admin/products" className="inline-flex items-center px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
            <Package className="w-4 h-4 mr-2" /> Productos
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-secondary-100 p-5 space-y-2">
            <div className={`inline-flex p-2 rounded-lg ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-secondary-900">{card.value}</p>
            <p className="text-sm text-secondary-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-secondary-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Órdenes Recientes</h2>
            <Link href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">Ver todas</Link>
          </div>
          <div className="space-y-3">
            {data.recentOrders.length === 0 ? (
              <p className="text-sm text-secondary-400 text-center py-8">No hay órdenes aún</p>
            ) : (
              data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-secondary-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{order.customerName}</p>
                    <p className="text-xs text-secondary-500">S/. {Number(order.total).toFixed(2)}</p>
                  </div>
                  <span className={`badge ${
                    order.status === "DELIVERED" ? "badge-success" :
                    order.status === "CANCELLED" ? "badge-danger" :
                    order.status === "CONFIRMED" ? "badge-info" : "badge-warning"
                  }`}>{order.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-secondary-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Alertas de Stock</h2>
            <Link href="/admin/inventory" className="text-sm text-primary-600 hover:text-primary-700">Ver todo</Link>
          </div>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-sm text-secondary-400 text-center py-8">Todo en stock suficiente</p>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-secondary-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-secondary-500">{p.brand.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${p.stock === 0 ? "text-danger-500" : "text-accent-600"}`}>
                      {p.stock} uds.
                    </p>
                    <p className="text-xs text-secondary-400">Mín: {p.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
