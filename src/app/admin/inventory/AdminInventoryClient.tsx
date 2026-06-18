"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { Package, AlertTriangle, CheckCircle, Plus, Minus } from "lucide-react";

interface Props {
  products: any[];
  movements: any[];
}

export function AdminInventoryClient({ products: initialProducts, movements: initialMovements }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [movements, setMovements] = useState(initialMovements);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState("1");
  const [type, setType] = useState<"IN" | "OUT" | "ADJUSTMENT">("IN");

  const lowStock = products.filter((p) => p.stock <= p.minStock && p.stock > 0);
  const outOfStock = products.filter((p) => p.stock === 0);

  const handleMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) return;

    try {
      const qty = type === "OUT" ? -parseInt(quantity) : parseInt(quantity);
      const res = await fetch("/api/inventory/movement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: selectedProduct, quantity: qty, type, notes: "Ajuste manual" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Movimiento registrado");
      setSelectedProduct("");
      setQuantity("1");
    } catch {
      toast.error("Error al registrar movimiento");
    }
  };

  return (
    <div className="page-container py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Control de Inventario</h1>
        <p className="text-sm text-secondary-500">{products.length} productos activos</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-secondary-100 p-5 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg"><Package className="w-6 h-6 text-green-600" /></div>
          <div>
            <p className="text-2xl font-bold">{products.filter((p) => p.stock > p.minStock).length}</p>
            <p className="text-sm text-secondary-500">Stock Normal</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-5 flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-lg"><AlertTriangle className="w-6 h-6 text-orange-600" /></div>
          <div>
            <p className="text-2xl font-bold">{lowStock.length}</p>
            <p className="text-sm text-secondary-500">Stock Bajo</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 p-5 flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
          <div>
            <p className="text-2xl font-bold">{outOfStock.length}</p>
            <p className="text-sm text-secondary-500">Agotados</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-secondary-100 p-6 space-y-4">
          <h2 className="font-semibold text-lg">Registrar Movimiento</h2>
          <form onSubmit={handleMovement} className="space-y-4">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Seleccionar producto...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.brand.name}) - Stock: {p.stock}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              {(["IN", "OUT", "ADJUSTMENT"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border-2 transition-colors ${
                    type === t
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-secondary-200 text-secondary-600 hover:border-secondary-300"
                  }`}
                >
                  {t === "IN" ? "Entrada" : t === "OUT" ? "Salida" : "Ajuste"}
                </button>
              ))}
            </div>

            <Input
              label="Cantidad"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" className="w-full">
              {type === "IN" ? <Plus className="w-4 h-4 mr-1" /> : <Minus className="w-4 h-4 mr-1" />}
              Registrar {type === "IN" ? "Entrada" : type === "OUT" ? "Salida" : "Ajuste"}
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-secondary-100 p-6 space-y-4">
          <h2 className="font-semibold text-lg">Movimientos Recientes</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {movements.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-secondary-50">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{m.product.name}</p>
                  <p className="text-xs text-secondary-500">{m.reference || m.notes} • {formatDate(m.createdAt)}</p>
                </div>
                <span className={`text-sm font-bold ${
                  m.quantity > 0 ? "text-success-600" : "text-danger-500"
                }`}>
                  {m.quantity > 0 ? "+" : ""}{m.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-secondary-100 p-6 space-y-4">
        <h2 className="font-semibold text-lg">Estado del Inventario</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-100 bg-secondary-50">
                <th className="text-left p-3 font-medium">Producto</th>
                <th className="text-left p-3 font-medium">Marca</th>
                <th className="text-right p-3 font-medium">Stock</th>
                <th className="text-right p-3 font-medium">Mínimo</th>
                <th className="text-center p-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-secondary-50">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3 text-secondary-500">{p.brand.name}</td>
                  <td className="p-3 text-right font-bold">{p.stock}</td>
                  <td className="p-3 text-right text-secondary-500">{p.minStock}</td>
                  <td className="p-3 text-center">
                    {p.stock === 0 ? (
                      <span className="badge-danger">Agotado</span>
                    ) : p.stock <= p.minStock ? (
                      <span className="badge-warning">Bajo</span>
                    ) : (
                      <span className="badge-success">OK</span>
                    )}
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
