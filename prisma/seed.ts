import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: "Capsa",
        slug: "capsa",
        description: "Baterías automotrices de alta calidad, líder en el mercado peruano.",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Solite",
        slug: "solite",
        description: "Baterías con tecnología avanzada para máximo rendimiento.",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Varta",
        slug: "varta",
        description: "Baterías premium alemanas con la más alta tecnología.",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Ultrabat",
        slug: "ultrabat",
        description: "Baterías de alto rendimiento para todo tipo de vehículos.",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Etna",
        slug: "etna",
        description: "Baterías confiables con excelente relación calidad-precio.",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Enerjet",
        slug: "enerjet",
        description: "Baterías de potencia superior para vehículos modernos.",
      },
    }),
  ]);

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Automóvil",
        slug: "automovil",
        description: "Baterías para autos de pasajeros y sedanes.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Camioneta",
        slug: "camioneta",
        description: "Baterías para camionetas y SUVs.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Camión",
        slug: "camion",
        description: "Baterías para camiones y vehículos pesados.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Moto",
        slug: "moto",
        description: "Baterías para motocicletas.",
      },
    }),
  ]);

  const productsData = [
    { name: "Batería Capsa 42Ah NS40", slug: "capsa-42ah-ns40", sku: "CAP-NS40", price: 189, costPrice: 140, stock: 25, minStock: 5, voltage: "12V", capacity: "42Ah", cca: "370A", brand: "capsa", category: "automovil", warranty: "12 meses" },
    { name: "Batería Capsa 55Ah NS60", slug: "capsa-55ah-ns60", sku: "CAP-NS60", price: 229, costPrice: 170, stock: 30, minStock: 5, voltage: "12V", capacity: "55Ah", cca: "480A", brand: "capsa", category: "automovil", warranty: "12 meses" },
    { name: "Batería Capsa 75Ah NX110", slug: "capsa-75ah-nx110", sku: "CAP-NX110", price: 299, costPrice: 220, stock: 15, minStock: 3, voltage: "12V", capacity: "75Ah", cca: "620A", brand: "capsa", category: "camioneta", warranty: "12 meses" },
    { name: "Batería Solite 42Ah NS40", slug: "solite-42ah-ns40", sku: "SOL-NS40", price: 199, costPrice: 148, stock: 20, minStock: 5, voltage: "12V", capacity: "42Ah", cca: "380A", brand: "solite", category: "automovil", warranty: "18 meses" },
    { name: "Batería Solite 55Ah NS60", slug: "solite-55ah-ns60", sku: "SOL-NS60", price: 249, costPrice: 185, stock: 22, minStock: 5, voltage: "12V", capacity: "55Ah", cca: "500A", brand: "solite", category: "automovil", warranty: "18 meses" },
    { name: "Batería Solite 100Ah NX150", slug: "solite-100ah-nx150", sku: "SOL-NX150", price: 389, costPrice: 290, stock: 8, minStock: 2, voltage: "12V", capacity: "100Ah", cca: "750A", brand: "solite", category: "camion", warranty: "18 meses" },
    { name: "Batería Varta 60Ah D53", slug: "varta-60ah-d53", sku: "VAR-D53", price: 359, costPrice: 270, stock: 10, minStock: 3, voltage: "12V", capacity: "60Ah", cca: "540A", brand: "varta", category: "automovil", warranty: "24 meses" },
    { name: "Batería Varta 70Ah E44", slug: "varta-70ah-e44", sku: "VAR-E44", price: 429, costPrice: 320, stock: 7, minStock: 2, voltage: "12V", capacity: "70Ah", cca: "650A", brand: "varta", category: "camioneta", warranty: "24 meses" },
    { name: "Batería Varta 95Ah G14", slug: "varta-95ah-g14", sku: "VAR-G14", price: 529, costPrice: 400, stock: 5, minStock: 2, voltage: "12V", capacity: "95Ah", cca: "800A", brand: "varta", category: "camion", warranty: "24 meses" },
    { name: "Batería Ultrabat 42Ah NS40", slug: "ultrabat-42ah-ns40", sku: "ULT-NS40", price: 175, costPrice: 130, stock: 18, minStock: 5, voltage: "12V", capacity: "42Ah", cca: "360A", brand: "ultrabat", category: "automovil", warranty: "12 meses" },
    { name: "Batería Ultrabat 55Ah NS60", slug: "ultrabat-55ah-ns60", sku: "ULT-NS60", price: 215, costPrice: 160, stock: 20, minStock: 5, voltage: "12V", capacity: "55Ah", cca: "460A", brand: "ultrabat", category: "automovil", warranty: "12 meses" },
    { name: "Batería Ultrabat 75Ah NX110", slug: "ultrabat-75ah-nx110", sku: "ULT-NX110", price: 279, costPrice: 210, stock: 12, minStock: 3, voltage: "12V", capacity: "75Ah", cca: "600A", brand: "ultrabat", category: "camioneta", warranty: "12 meses" },
    { name: "Batería Etna 35Ah", slug: "etna-35ah", sku: "ETN-35", price: 149, costPrice: 110, stock: 15, minStock: 5, voltage: "12V", capacity: "35Ah", cca: "300A", brand: "etna", category: "moto", warranty: "6 meses" },
    { name: "Batería Etna 50Ah NS40", slug: "etna-50ah-ns40", sku: "ETN-NS40", price: 179, costPrice: 135, stock: 0, minStock: 5, voltage: "12V", capacity: "50Ah", cca: "420A", brand: "etna", category: "automovil", warranty: "12 meses" },
    { name: "Batería Enerjet 55Ah NS60", slug: "enerjet-55ah-ns60", sku: "ENJ-NS60", price: 239, costPrice: 178, stock: 14, minStock: 5, voltage: "12V", capacity: "55Ah", cca: "490A", brand: "enerjet", category: "automovil", warranty: "18 meses" },
    { name: "Batería Enerjet 80Ah NX110", slug: "enerjet-80ah-nx110", sku: "ENJ-NX110", price: 319, costPrice: 240, stock: 9, minStock: 3, voltage: "12V", capacity: "80Ah", cca: "680A", brand: "enerjet", category: "camioneta", warranty: "18 meses" },
    { name: "Batería Enerjet 100Ah NX150", slug: "enerjet-100ah-nx150", sku: "ENJ-NX150", price: 399, costPrice: 300, stock: 6, minStock: 2, voltage: "12V", capacity: "100Ah", cca: "760A", brand: "enerjet", category: "camion", warranty: "18 meses" },
  ];

  for (const p of productsData) {
    const brand = brands.find((b) => b.slug === p.brand)!;
    const category = categories.find((c) => c.slug === p.category)!;
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        price: p.price,
        costPrice: p.costPrice,
        stock: p.stock,
        minStock: p.minStock,
        voltage: p.voltage,
        capacity: p.capacity,
        cca: p.cca,
        warranty: p.warranty,
        brandId: brand.id,
        categoryId: category.id,
        description: `${p.name} - Voltaje: ${p.voltage}, Capacidad: ${p.capacity}, CCA: ${p.cca}. Ideal para su vehículo.`,
      },
    });
  }

  const admin = await prisma.user.create({
    data: {
      email: "admin@leandrobaterias.com",
      passwordHash: "$2b$10$placeholder", // Use bcrypt in real scenario
      name: "Admin Leandro Baterías",
      role: "ADMIN",
      phone: "+51 999 888 777",
    },
  });

  console.log(`Created ${brands.length} brands`);
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${productsData.length} products`);
  console.log(`Created admin user: ${admin.email}`);
  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
