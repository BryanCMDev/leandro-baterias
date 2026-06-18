"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Menu, X, Battery, Package, Search } from "lucide-react";

export function Header() {
  const { totalItems, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-secondary-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Battery className="w-8 h-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
            <div>
              <span className="font-bold text-xl text-secondary-900">Leandro Baterías</span>
              <p className="text-xs text-secondary-500 -mt-1">Cusco - Perú</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors">
              Inicio
            </Link>
            <Link href="/products" className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors">
              Productos
            </Link>
            <Link href="/products?brand=capsa" className="text-sm text-secondary-500 hover:text-primary-600 transition-colors">
              Capsa
            </Link>
            <Link href="/products?brand=solite" className="text-sm text-secondary-500 hover:text-primary-600 transition-colors">
              Solite
            </Link>
            <Link href="/products?brand=varta" className="text-sm text-secondary-500 hover:text-primary-600 transition-colors">
              Varta
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleCart}
              className="relative p-2 text-secondary-600 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </button>

            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <Package className="w-4 h-4 mr-1" />
                Admin
              </Button>
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-secondary-600"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-secondary-100">
          <div className="px-4 py-3 space-y-2">
            <Link href="/" className="block py-2 text-sm font-medium text-secondary-700">Inicio</Link>
            <Link href="/products" className="block py-2 text-sm font-medium text-secondary-700">Productos</Link>
            <Link href="/products?brand=capsa" className="block py-2 text-sm text-secondary-500">Capsa</Link>
            <Link href="/products?brand=solite" className="block py-2 text-sm text-secondary-500">Solite</Link>
            <Link href="/products?brand=varta" className="block py-2 text-sm text-secondary-500">Varta</Link>
            <Link href="/products?brand=ultrabat" className="block py-2 text-sm text-secondary-500">Ultrabat</Link>
            <Link href="/products?brand=etna" className="block py-2 text-sm text-secondary-500">Etna</Link>
            <Link href="/products?brand=enerjet" className="block py-2 text-sm text-secondary-500">Enerjet</Link>
          </div>
        </div>
      )}
    </header>
  );
}
