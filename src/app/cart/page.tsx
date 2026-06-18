"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, CreditCard } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="page-container py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10 text-secondary-400" />
        </div>
        <h1 className="text-2xl font-bold text-secondary-900">Tu carrito está vacío</h1>
        <p className="text-secondary-500">Agrega productos para empezar tu compra</p>
        <Link href="/products">
          <Button variant="primary">Ver Productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Carrito de Compras</h1>
          <p className="text-secondary-500">{totalItems} productos</p>
        </div>
        <Link href="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Seguir Comprando
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-xl border border-secondary-100 p-4 flex gap-4">
              <div className="w-20 h-20 bg-secondary-50 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-2xl">🔋</span>
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="font-semibold text-secondary-900 hover:text-primary-600">
                  {item.name}
                </Link>
                <p className="text-sm text-secondary-500 mt-0.5">{formatCurrency(item.price)} c/u</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-secondary-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 hover:bg-secondary-50 text-secondary-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-secondary-50 text-secondary-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-danger-500 hover:text-danger-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Quitar
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-lg text-secondary-900">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-secondary-100 p-6 h-fit space-y-4 sticky top-24">
          <h2 className="font-semibold text-lg text-secondary-900">Resumen</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-secondary-600">
              <span>Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-secondary-600">
              <span>IGV (18%)</span>
              <span>{formatCurrency(totalPrice * 0.18)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg text-secondary-900">
              <span>Total</span>
              <span>{formatCurrency(totalPrice * 1.18)}</span>
            </div>
          </div>
          <p className="text-xs text-secondary-400">Métodos de pago: Yape, Plin, Tarjeta, Efectivo</p>
          <Link href="/checkout">
            <Button variant="primary" className="w-full" size="lg">
              <CreditCard className="w-4 h-4 mr-2" /> Proceder al Pago
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
