"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Battery, AlertTriangle, Check } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    minStock: number;
    imageUrl: string | null;
    voltage: string | null;
    capacity: string | null;
    cca: string | null;
    warranty: string | null;
    brand: { name: string; slug: string };
    category: { name: string; slug: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);
  const isLowStock = product.stock > 0 && product.stock <= product.minStock;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      imageUrl: product.imageUrl,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-white rounded-xl border border-secondary-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center p-8">
          <Battery className="w-24 h-24 text-primary-300 group-hover:text-primary-500 transition-colors duration-300" />
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-primary-600 uppercase tracking-wider">
              {product.brand.name}
            </p>
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-sm font-semibold text-secondary-900 hover:text-primary-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.voltage && (
            <span className="px-2 py-0.5 bg-secondary-100 text-secondary-600 text-xs rounded-md">{product.voltage}</span>
          )}
          {product.capacity && (
            <span className="px-2 py-0.5 bg-secondary-100 text-secondary-600 text-xs rounded-md">{product.capacity}</span>
          )}
          {product.cca && (
            <span className="px-2 py-0.5 bg-secondary-100 text-secondary-600 text-xs rounded-md">{product.cca}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-secondary-50">
          <div>
            <p className="text-lg font-bold text-secondary-900">{formatCurrency(Number(product.price))}</p>
            {product.warranty && (
              <p className="text-xs text-secondary-400">Garantía: {product.warranty}</p>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            {isOutOfStock ? (
              <span className="text-xs font-medium text-danger-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Agotado
              </span>
            ) : isLowStock ? (
              <span className="text-xs font-medium text-accent-600">Quedan {product.stock}</span>
            ) : (
              <span className="text-xs text-secondary-400">En stock</span>
            )}
          </div>
        </div>

        <Button
          variant={isOutOfStock ? "secondary" : "primary"}
          className="w-full"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {added ? (
            <><Check className="w-4 h-4 mr-1" /> Agregado</>
          ) : isOutOfStock ? (
            "Agotado"
          ) : (
            <><ShoppingCart className="w-4 h-4 mr-1" /> Agregar al Carrito</>
          )}
        </Button>
      </div>
    </div>
  );
}
