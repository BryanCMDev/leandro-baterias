import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Demo: allow admin login with any password for admin@leandrobaterias.com
    const demoEmail = "admin@leandrobaterias.com";
    const demoPassword = "admin123";

    if (email === demoEmail && password === demoPassword) {
      return NextResponse.json({
        user: { email: demoEmail, name: "Admin Leandro Baterías", role: "ADMIN" },
        token: "demo-token",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    // Simple password check (in production, use bcrypt)
    if (password !== "admin123") {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    return NextResponse.json({
      user: { email: user.email, name: user.name, role: user.role },
      token: "demo-token",
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 });
  }
}
