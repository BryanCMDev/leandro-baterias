import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const brandSlug = typeof params.brand === "string" ? params.brand : undefined;
  const categorySlug = typeof params.category === "string" ? params.category : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;

  const where: any = { isActive: true };
  if (brandSlug) where.brand = { slug: brandSlug };
  if (categorySlug) where.category = { slug: categorySlug };
  if (search) where.name = { contains: search, mode: "insensitive" };

  const [products, brands, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: true, category: true },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const serializedProducts = JSON.parse(JSON.stringify(products));

  const selectedBrand = brands.find((b) => b.slug === brandSlug);

  return (
    <div className="page-container py-8 space-y-6">
      <div>
        <h1 className="section-title">
          {selectedBrand ? `Baterías ${selectedBrand.name}` : "Todos los Productos"}
        </h1>
        <p className="text-secondary-500 mt-1">
          {serializedProducts.length} producto{serializedProducts.length !== 1 ? "s" : ""} disponibles
        </p>
      </div>

      <ProductFilters brands={brands} categories={categories} currentBrand={brandSlug} currentCategory={categorySlug} />

      {serializedProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔋</span>
          </div>
          <h2 className="text-lg font-semibold text-secondary-700">No encontramos productos</h2>
          <p className="text-secondary-500 mt-1">Prueba con otros filtros o busca otra marca</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {serializedProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
