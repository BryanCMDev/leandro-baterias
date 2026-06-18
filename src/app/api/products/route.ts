import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand");
    const category = searchParams.get("category");
    const active = searchParams.get("active") !== "false";

    const where: any = { isActive: active };
    if (brand) where.brand = { slug: brand };
    if (category) where.category = { slug: category };

    const products = await prisma.product.findMany({
      where,
      include: { brand: true, category: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, sku, description, price, costPrice, stock, minStock, voltage, capacity, cca, warranty, brandId, categoryId } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        description,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
        stock: parseInt(stock),
        minStock: parseInt(minStock),
        voltage,
        capacity,
        cca,
        warranty,
        brandId,
        categoryId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
