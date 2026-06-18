"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import { Plus, Edit2, Search, Package, AlertTriangle } from "lucide-react";

interface Props {
  products: any[];
  brands: any[];
  categories: any[];
}

export function AdminProductsClient({ products: initialProducts, brands, categories }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", sku: "", price: "", costPrice: "", stock: "0", minStock: "5",
    voltage: "", capacity: "", cca: "", warranty: "12 meses",
    brandId: brands[0]?.id || "", categoryId: categories[0]?.id || "",
    description: "",
  });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug }),
      });
      if (!res.ok) throw new Error();
      const product = await res.json();
      setProducts([product, ...products]);
      setShowForm(false);
      setForm({ name: "", sku: "", price: "", costPrice: "", stock: "0", minStock: "5", voltage: "", capacity: "", cca: "", warranty: "12 meses", brandId: brands[0]?.id || "", categoryId: categories[0]?.id || "", description: "" });
      toast.success("Producto creado");
    } catch {
      toast.error("Error al crear producto");
    }
  };

  return (
    <div className="page-container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-secondary-500">{products.length} productos registrados</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> Nuevo Producto
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-secondary-100 p-6 space-y-4">
          <h2 className="font-semibold">Nuevo Producto</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <Input label="Precio Venta" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="Precio Costo" type="number" step="0.01" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} required />
            <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <Input label="Stock Mínimo" type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
            <Input label="Voltaje" value={form.voltage} onChange={(e) => setForm({ ...form, voltage: e.target.value })} placeholder="12V" />
            <Input label="Capacidad" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="55Ah" />
            <Input label="CCA" value={form.cca} onChange={(e) => setForm({ ...form, cca: e.target.value })} placeholder="480A" />
            <Input label="Garantía" value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} />
            <select
              value={form.brandId}
              onChange={(e) => setForm({ ...form, brandId: e.target.value })}
              className="px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-2">
            <Button type="submit" variant="primary">Guardar</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-secondary-100">
        <div className="p-4 border-b border-secondary-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-100 bg-secondary-50">
                <th className="text-left p-3 font-medium text-secondary-600">Producto</th>
                <th className="text-left p-3 font-medium text-secondary-600">SKU</th>
                <th className="text-left p-3 font-medium text-secondary-600">Marca</th>
                <th className="text-right p-3 font-medium text-secondary-600">Precio</th>
                <th className="text-right p-3 font-medium text-secondary-600">Stock</th>
                <th className="text-center p-3 font-medium text-secondary-600">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-secondary-50 hover:bg-secondary-50/50">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-secondary-500">{p.sku}</td>
                  <td className="p-3">{p.brand.name}</td>
                  <td className="p-3 text-right">{formatCurrency(Number(p.price))}</td>
                  <td className="p-3 text-right">
                    <span className={p.stock <= p.minStock ? "text-danger-500 font-bold" : ""}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {p.stock === 0 ? (
                      <span className="badge-danger">Agotado</span>
                    ) : p.stock <= p.minStock ? (
                      <span className="badge-warning">Bajo</span>
                    ) : (
                      <span className="badge-success">Disponible</span>
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
