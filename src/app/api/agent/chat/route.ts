import { NextResponse } from "next/server";
import { askResidentAgent, generateWeeklyReport } from "@/agents/resident-agent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, type } = body;

    if (type === "report") {
      const report = await generateWeeklyReport();
      return NextResponse.json({ response: report, type: "report" });
    }

    if (!question) {
      return NextResponse.json({ error: "Se requiere una pregunta" }, { status: 400 });
    }

    const response = await askResidentAgent(question);
    return NextResponse.json({ response, type: "chat" });
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json(
      { error: "Error al procesar la consulta con el agente IA" },
      { status: 500 }
    );
  }
}
