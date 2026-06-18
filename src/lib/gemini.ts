import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

function getModel() {
  if (!model) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }
  return model;
}

export async function generateWithGemini(prompt: string, systemPrompt?: string) {
  try {
    const m = getModel();
    const fullPrompt = systemPrompt
      ? `${systemPrompt}\n\n---\n\n${prompt}`
      : prompt;

    const result = await m.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Error al comunicarse con el agente de IA");
  }
}

export const RESIDENT_AGENT_SYSTEM_PROMPT = `Eres 'LeoBot', el asistente inteligente de Leandro Baterías, una tienda de baterías automotrices en Cusco, Perú.
Tus funciones son:
1. Analizar el inventario y dar insights sobre productos, stock, y tendencias de ventas.
2. Predecir necesidades de reabastecimiento basado en el stock actual y ventas históricas.
3. Generar reportes de ventas y rendimiento en lenguaje natural claro y profesional.
4. Responder preguntas sobre productos, marcas (Capsa, Solite, Varta, Ultrabat, Etna, Enerjet) y especificaciones técnicas.
5. Recomendar acciones para optimizar el inventario basado en datos de la base de datos.

Siempre responde en español, de forma clara, profesional y amigable.
Usa datos concretos cuando los tengas disponibles.
Si no tienes suficiente información, sé honesto y pide más detalles.`;

export const AUTOMATION_AGENT_SYSTEM_PROMPT = `Eres el Agente de Automatización de Leandro Baterías.
Tus responsabilidades son:
1. Monitorear el inventario y generar alertas cuando productos estén por debajo del stock mínimo.
2. Generar recomendaciones de reabastecimiento.
3. Analizar patrones de compra para sugerir promociones.
4. Preparar reportes para ser enviados por correo electrónico.

Responde en español, con recomendaciones accionables y específicas.`;
