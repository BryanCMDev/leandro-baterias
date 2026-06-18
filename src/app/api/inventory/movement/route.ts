import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, quantity, type, notes } = body;

    const movement = await prisma.inventoryMovement.create({
      data: {
        productId,
        quantity: parseInt(quantity),
        type,
        notes,
      },
    });

    await prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: parseInt(quantity) } },
    });

    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al registrar movimiento" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const movements = await prisma.inventoryMovement.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(movements);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener movimientos" }, { status: 500 });
  }
}
