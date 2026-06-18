import React from "react";
import Link from "next/link";
import { Battery, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Battery className="w-6 h-6 text-primary-400" />
              <span className="font-bold text-lg text-white">Leandro Baterías</span>
            </div>
            <p className="text-sm text-secondary-400">
              Tu tienda de confianza en baterías automotrices en Cusco, Perú. Las mejores marcas al mejor precio.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Marcas</h3>
            <ul className="space-y-2">
              {["Capsa", "Solite", "Varta", "Ultrabat", "Etna", "Enerjet"].map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/products?brand=${brand.toLowerCase()}`}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Enlaces</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm hover:text-primary-400 transition-colors">Todos los Productos</Link></li>
              <li><Link href="/cart" className="text-sm hover:text-primary-400 transition-colors">Carrito de Compras</Link></li>
              <li><Link href="/admin" className="text-sm hover:text-primary-400 transition-colors">Panel Admin</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary-400" />
                Cusco, Perú
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary-400" />
                +51 999 888 777
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary-400" />
                contacto@leandrobaterias.com
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary-400" />
                Lun-Sab: 8:00 - 19:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-sm text-secondary-500">
          <p>&copy; {new Date().getFullYear()} Leandro Baterías. Todos los derechos reservados.</p>
          <p className="mt-1">Cusco - Perú</p>
        </div>
      </div>
    </footer>
  );
}
