import { NextResponse } from "next/server";
import { checkLowStockAlerts, analyzeSalesPatterns, generateAutomatedRestockOrder } from "@/agents/automation-agent";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "alerts";

    let result;
    switch (type) {
      case "alerts":
        result = await checkLowStockAlerts();
        break;
      case "analysis":
        result = await analyzeSalesPatterns();
        break;
      case "restock":
        result = await generateAutomatedRestockOrder();
        break;
      default:
        result = await checkLowStockAlerts();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Automation agent error:", error);
    return NextResponse.json(
      { error: "Error en el agente de automatización" },
      { status: 500 }
    );
  }
}
