"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/products/ProductCard";
import { formatCurrency } from "@/lib/utils";
import { Battery, ShoppingCart, Check, Shield, Truck, Info, ChevronLeft } from "lucide-react";

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);

  const specs = [
    { label: "Voltaje", value: product.voltage },
    { label: "Capacidad", value: product.capacity },
    { label: "CCA (Amperaje)", value: product.cca },
    { label: "Tipo de Bornes", value: product.terminalType },
    { label: "Garantía", value: product.warranty },
    { label: "SKU", value: product.sku },
    { label: "Marca", value: product.brand.name },
    { label: "Categoría", value: product.category.name },
  ].filter((s) => s.value);

  const handleAddToCart = () => {
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
    <div className="page-container py-8 space-y-8">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-secondary-500 hover:text-primary-600">
        <ChevronLeft className="w-4 h-4" /> Volver a Productos
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-2xl flex items-center justify-center p-12 aspect-square">
          <Battery className="w-48 h-48 text-primary-400" />
        </div>

        <div className="space-y-6">
          <div>
            <span className="badge-info">{product.brand.name}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mt-2">{product.name}</h1>
            <p className="text-secondary-600 mt-2">{product.description}</p>
          </div>

          <div className="text-3xl font-bold text-primary-600">{formatCurrency(Number(product.price))}</div>

          <div className="grid grid-cols-2 gap-3">
            {specs.map((spec) => (
              <div key={spec.label} className="bg-secondary-50 rounded-lg p-3">
                <p className="text-xs text-secondary-500">{spec.label}</p>
                <p className="text-sm font-medium text-secondary-900">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-secondary-600">
              <Shield className="w-4 h-4 text-primary-500" />
              Garantía incluida
            </div>
            <div className="flex items-center gap-1 text-secondary-600">
              <Truck className="w-4 h-4 text-primary-500" />
              Envío a Cusco
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {product.stock === 0 ? (
              <Button variant="secondary" disabled className="w-full">
                Producto Agotado
              </Button>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${product.stock > product.minStock ? "bg-success-500" : "bg-accent-500"}`} />
                  <span className={product.stock > product.minStock ? "text-success-600" : "text-accent-600"}>
                    {product.stock > product.minStock
                      ? `${product.stock} unidades en stock`
                      : `Solo quedan ${product.stock} unidades`}
                  </span>
                </div>
                <Button variant="primary" size="lg" className="w-full" onClick={handleAddToCart}>
                  {added ? (
                    <><Check className="w-5 h-5 mr-2" /> Agregado al Carrito</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5 mr-2" /> Agregar al Carrito</>
                  )}
                </Button>
              </>
            )}
          </div>

          <div className="bg-primary-50 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-primary-600 mt-0.5" />
            <div className="text-sm text-primary-800">
              <p className="font-medium">¿No estás seguro de cuál elegir?</p>
              <p>Contáctanos al <strong>+51 999 888 777</strong> y te asesoramos.</p>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-secondary-100">
          <h2 className="section-title">También de {product.brand.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
