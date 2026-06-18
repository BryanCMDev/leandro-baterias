"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import { CreditCard, Smartphone, Banknote, Loader2, Check } from "lucide-react";

const paymentMethods = [
  { id: "YAPE", label: "Yape", icon: Smartphone, desc: "Paga con Yape desde tu app" },
  { id: "PLIN", label: "Plin", icon: Smartphone, desc: "Paga con Plin desde tu app" },
  { id: "CARD", label: "Tarjeta", icon: CreditCard, desc: "Visa, Mastercard, Débito" },
  { id: "CASH", label: "Efectivo", icon: Banknote, desc: "Paga en efectivo al recibir" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    doc: "",
    paymentMethod: "YAPE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
        }),
      });

      if (!res.ok) throw new Error("Error al procesar la orden");

      const data = await res.json();
      clearCart();
      setDone(true);
      toast.success("¡Pedido realizado con éxito!");

      setTimeout(() => router.push(`/`), 3000);
    } catch (err) {
      toast.error("Error al procesar el pedido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !done) {
    return (
      <div className="page-container py-20 text-center">
        <p className="text-secondary-500">No hay productos en tu carrito</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="page-container py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-success-500" />
        </div>
        <h1 className="text-2xl font-bold text-secondary-900">¡Pedido Confirmado!</h1>
        <p className="text-secondary-500">Te contactaremos para coordinar la entrega.</p>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <h1 className="text-2xl font-bold text-secondary-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-secondary-100 p-6 space-y-4">
            <h2 className="font-semibold text-lg">Información de Contacto</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombre Completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <Input label="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <Input label="Dirección de Entrega" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Input label="DNI / RUC" value={form.doc} onChange={(e) => setForm({ ...form, doc: e.target.value })} placeholder="Opcional para factura" />
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 p-6 space-y-4">
            <h2 className="font-semibold text-lg">Método de Pago</h2>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: method.id })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.paymentMethod === method.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-secondary-100 hover:border-secondary-300"
                  }`}
                >
                  <method.icon className={`w-6 h-6 mb-2 ${form.paymentMethod === method.id ? "text-primary-600" : "text-secondary-400"}`} />
                  <p className="font-semibold text-sm">{method.label}</p>
                  <p className="text-xs text-secondary-500">{method.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading} disabled={items.length === 0}>
            {loading ? "Procesando..." : `Pagar ${formatCurrency(totalPrice * 1.18)}`}
          </Button>
        </form>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-secondary-100 p-6 space-y-4 sticky top-24">
            <h2 className="font-semibold text-lg">Resumen del Pedido</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-secondary-600 truncate">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-secondary-600">
                <span>Subtotal</span><span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-secondary-600">
                <span>IGV (18%)</span><span>{formatCurrency(totalPrice * 0.18)}</span>
              </div>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary-600">{formatCurrency(totalPrice * 1.18)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
