"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { Search, Eye } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "badge-warning",
  CONFIRMED: "badge-info",
  SHIPPED: "badge-info",
  DELIVERED: "badge-success",
  CANCELLED: "badge-danger",
};

interface Props {
  orders: any[];
}

export function AdminOrdersClient({ orders: initialOrders }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const filtered = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success(`Orden actualizada a ${status}`);
    } catch {
      toast.error("Error al actualizar");
    }
  };

  return (
    <div className="page-container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Órdenes</h1>
        <p className="text-sm text-secondary-500">{orders.length} órdenes registradas</p>
      </div>

      <div className="bg-white rounded-xl border border-secondary-100">
        <div className="p-4 border-b border-secondary-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Buscar por orden o cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-100 bg-secondary-50">
                <th className="text-left p-3 font-medium text-secondary-600">Orden</th>
                <th className="text-left p-3 font-medium text-secondary-600">Cliente</th>
                <th className="text-left p-3 font-medium text-secondary-600">Método</th>
                <th className="text-right p-3 font-medium text-secondary-600">Total</th>
                <th className="text-center p-3 font-medium text-secondary-600">Estado</th>
                <th className="text-center p-3 font-medium text-secondary-600">Fecha</th>
                <th className="text-center p-3 font-medium text-secondary-600">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-secondary-50 hover:bg-secondary-50/50">
                  <td className="p-3 font-mono text-xs">{order.orderNumber}</td>
                  <td className="p-3">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-secondary-500">{order.customerEmail}</p>
                  </td>
                  <td className="p-3">{order.paymentMethod}</td>
                  <td className="p-3 text-right font-medium">{formatCurrency(Number(order.total))}</td>
                  <td className="p-3 text-center">
                    <span className={statusColors[order.status] || "badge-info"}>{order.status}</span>
                  </td>
                  <td className="p-3 text-center text-xs text-secondary-500">{formatDate(order.createdAt)}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-1">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs px-2 py-1 border rounded"
                      >
                        <option value="PENDING">Pendiente</option>
                        <option value="CONFIRMED">Confirmado</option>
                        <option value="SHIPPED">Enviado</option>
                        <option value="DELIVERED">Entregado</option>
                        <option value="CANCELLED">Cancelado</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
