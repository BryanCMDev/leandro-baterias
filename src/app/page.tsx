import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import type { ProductWithBrand } from "@/types";
import { Battery, Truck, Shield, CreditCard, ArrowRight, Star } from "lucide-react";

async function getFeaturedProducts(): Promise<ProductWithBrand[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, stock: { gt: 0 } },
    include: { brand: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  return JSON.parse(JSON.stringify(products));
}

async function getBrands() {
  return prisma.brand.findMany({ orderBy: { name: "asc" } });
}

export default async function HomePage() {
  const [products, brands] = await Promise.all([
    getFeaturedProducts(),
    getBrands(),
  ]);

  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="page-container py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="badge-info">Tienda Oficial en Cusco</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 leading-tight">
                Baterías Automotrices{" "}
                <span className="gradient-text">de Confianza</span>
              </h1>
              <p className="text-lg text-secondary-600 leading-relaxed">
                Las mejores marcas: Capsa, Solite, Varta, Ultrabat, Etna y Enerjet.
                Envíos a domicilio en todo Cusco. Paga con Yape, Plin o Tarjeta.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products">
                  <Button variant="primary" size="lg">
                    Ver Catálogo <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/products?brand=varta">
                  <Button variant="outline" size="lg">
                    Varta Premium
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-secondary-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                  <span>4.9/5</span>
                </div>
                <span>+500 clientes satisfechos</span>
                <span>6 marcas oficiales</span>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-primary-200 to-primary-400 rounded-full blur-3xl opacity-20 absolute" />
                <Battery className="w-64 h-64 text-primary-600 relative" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-secondary-100">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Battery, title: "6 Marcas Oficiales", desc: "Capsa, Solite, Varta y más" },
              { icon: Truck, title: "Envío Rápido", desc: "Entrega en Cusco en 24h" },
              { icon: Shield, title: "Garantía Real", desc: "Hasta 24 meses de cobertura" },
              { icon: CreditCard, title: "Pago Seguro", desc: "Yape, Plin, Tarjeta o Efectivo" },
            ].map((item) => (
              <div key={item.title} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-xl">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-sm text-secondary-900">{item.title}</h3>
                <p className="text-xs text-secondary-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="page-container space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-title">Productos Destacados</h2>
              <p className="text-secondary-500 mt-1">Las baterías más vendidas</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" size="sm">
                Ver Todos <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="page-container space-y-8">
          <div className="text-center space-y-2">
            <h2 className="section-title">Nuestras Marcas</h2>
            <p className="text-secondary-500">Distribuidores autorizados de las mejores marcas</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-secondary-100 hover:border-primary-200 hover:shadow-md transition-all duration-300 bg-white"
              >
                <Battery className="w-10 h-10 text-primary-400 group-hover:text-primary-600 transition-colors" />
                <span className="font-semibold text-sm text-secondary-700 group-hover:text-primary-600 text-center">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="page-container text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            ¿Necesitas Asesoría?
          </h2>
          <p className="text-primary-100 max-w-xl mx-auto">
            Contáctanos y te ayudamos a elegir la batería perfecta para tu vehículo.
            También puedes usar nuestro asistente IA en el panel de administración.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" className="bg-white text-primary-700 hover:bg-primary-50">
              WhatsApp: +51 999 888 777
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
