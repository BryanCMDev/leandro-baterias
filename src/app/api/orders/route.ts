import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber, generateInvoiceNumber } from "@/lib/utils";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        invoice: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener órdenes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, doc, paymentMethod, items } = body;

    const orderNumber = generateOrderNumber();

    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerAddress: address,
        customerDoc: doc,
        subtotal,
        tax,
        total,
        status: "PENDING",
        paymentMethod: paymentMethod,
        paymentStatus: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
        invoice: {
          create: {
            invoiceNumber: generateInvoiceNumber(doc && doc.length === 11 ? "F" : "B"),
            type: doc && doc.length === 11 ? "FACTURA" : "BOLETA",
            subtotal,
            tax,
            total,
          },
        },
      },
      include: { items: true, invoice: true },
    });

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
      await prisma.inventoryMovement.create({
        data: {
          productId: item.productId,
          quantity: -item.quantity,
          type: "OUT",
          reference: `Orden: ${orderNumber}`,
        },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Error al procesar la orden" }, { status: 500 });
  }
}
