"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";

export function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={toggleCart} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-secondary-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-lg text-secondary-900">Carrito</h2>
              <span className="text-sm text-secondary-500">({totalItems} items)</span>
            </div>
            <button onClick={toggleCart} className="p-1 text-secondary-400 hover:text-secondary-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
                <p className="text-secondary-500">Tu carrito está vacío</p>
                <Link href="/products" onClick={toggleCart}>
                  <Button variant="primary" size="sm" className="mt-4">
                    Ver Productos
                  </Button>
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="flex gap-3 bg-secondary-50 rounded-lg p-3">
                  <div className="w-16 h-16 bg-secondary-200 rounded-lg flex items-center justify-center text-secondary-400 font-bold text-sm shrink-0">
                    {item.name.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">{item.name}</p>
                    <p className="text-sm font-semibold text-primary-600 mt-1">{formatCurrency(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 rounded-md hover:bg-secondary-200 text-secondary-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 rounded-md hover:bg-secondary-200 text-secondary-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs text-danger-500 hover:text-danger-600 mt-2"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-secondary-100 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Subtotal</span>
                <span className="font-semibold text-secondary-900">{formatCurrency(totalPrice)}</span>
              </div>
              <p className="text-xs text-secondary-400">IGV incluido. Envío calculado al checkout.</p>
              <Link href="/checkout" onClick={toggleCart}>
                <Button variant="primary" className="w-full">
                  Ir a Pagar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
