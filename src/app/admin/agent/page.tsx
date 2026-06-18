"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Bot, Send, Loader2, FileText, AlertTriangle, TrendingUp, RefreshCw, MessageSquare } from "lucide-react";


interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy **LeoBot**, tu asistente inteligente de inventario. Puedo ayudarte a:\n\n- 📊 Analizar el estado del inventario\n- 📈 Generar reportes de ventas\n- 🚨 Alertar sobre productos con stock bajo\n- 💡 Recomendar reabastecimientos\n- 🔮 Predecir necesidades de inventario\n\n¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [automationResult, setAutomationResult] = useState<string | null>(null);
  const [automationLoading, setAutomationLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "automation">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, type: "chat" }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ Lo siento, ocurrió un error al procesar tu consulta. Verifica que la API key de Gemini esté configurada correctamente." }]);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: "Genera un reporte semanal ejecutivo del inventario y ventas." }]);
    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "report" }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ Error al generar el reporte." }]);
    } finally {
      setLoading(false);
    }
  };

  const runAutomation = async (type: "alerts" | "analysis" | "restock") => {
    setAutomationLoading(true);
    setAutomationResult(null);
    try {
      const res = await fetch(`/api/agent/automation?type=${type}`);
      const data = await res.json();
      if (typeof data === "string") {
        setAutomationResult(data);
      } else if (data.analysis) {
        setAutomationResult(data.analysis);
      } else if (data.message) {
        setAutomationResult(data.message);
      } else if (data.restockRecommendation) {
        setAutomationResult(data.restockRecommendation);
      } else if (data.alerts) {
        const alertText = data.alerts.map((a: any) =>
          `- **${a.productName}**: Stock ${a.currentStock} (mínimo ${a.minStock}) - Urgencia: **${a.urgency}**`
        ).join("\n");
        setAutomationResult(`### Alertas de Stock Bajo\n\n${alertText}\n\n---\n\n${data.analysis || ""}`);
      } else {
        setAutomationResult(JSON.stringify(data, null, 2));
      }
    } catch {
      setAutomationResult("❌ Error al ejecutar automatización. Verifica la API key de Gemini.");
    } finally {
      setAutomationLoading(false);
    }
  };

  const quickQuestions = [
    "¿Cómo está el inventario actual?",
    "¿Qué productos necesito reabastecer?",
    "¿Cuáles son los productos más vendidos?",
    "Recomendaciones para optimizar stock",
  ];

  return (
    <div className="page-container py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Agentes de IA</h1>
          <p className="text-sm text-secondary-500">LeoBot - Asistente Inteligente de Inventario</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "chat" ? "bg-primary-100 text-primary-700" : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-1" /> Agente Residente (Chat)
        </button>
        <button
          onClick={() => setActiveTab("automation")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "automation" ? "bg-primary-100 text-primary-700" : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
          }`}
        >
          <FileText className="w-4 h-4 inline mr-1" /> Agente de Automatización
        </button>
      </div>

      {activeTab === "chat" ? (
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-xl border border-secondary-100 flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-primary-600 text-white"
                        : "bg-secondary-50 text-secondary-900 border border-secondary-100"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      {msg.content.split("\n").map((line, j) => (
                        <p key={j} className={msg.role === "user" ? "text-white" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-secondary-50 border border-secondary-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-secondary-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      LeoBot está pensando...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-secondary-100 p-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="text-xs px-3 py-1.5 bg-secondary-50 text-secondary-600 rounded-full hover:bg-secondary-100 border border-secondary-200 transition-colors"
                  >
                    {q}
                  </button>
                ))}
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100 border border-primary-200 transition-colors"
                >
                  <FileText className="w-3 h-3 inline mr-1" />
                  Generar Reporte Semanal
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-4 py-2.5 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Pregunta a LeoBot sobre el inventario..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button variant="primary" onClick={handleSend} disabled={loading || !input.trim()}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 p-5 space-y-4 h-fit sticky top-24">
            <h3 className="font-semibold text-sm text-secondary-900">¿Qué puede hacer LeoBot?</h3>
            <ul className="space-y-3 text-sm text-secondary-600">
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-primary-500 mt-0.5" />
                <span>Analizar tendencias de ventas</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-accent-500 mt-0.5" />
                <span>Detectar productos con stock crítico</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-primary-500 mt-0.5" />
                <span>Generar reportes ejecutivos semanales</span>
              </li>
              <li className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-primary-500 mt-0.5" />
                <span>Recomendar reabastecimientos</span>
              </li>
            </ul>
            <div className="border-t border-secondary-100 pt-4">
              <p className="text-xs text-secondary-400">
                LeoBot utiliza Google Gemini AI para analizar los datos en tiempo real de tu base de datos.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-secondary-100 p-6 space-y-4">
              <h2 className="font-semibold text-lg">Agente de Automatización</h2>
              <p className="text-sm text-secondary-600">
                Este agente monitorea automáticamente el inventario, genera alertas y recomienda acciones
                basadas en patrones de compra y niveles de stock.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => runAutomation("alerts")}
                  disabled={automationLoading}
                  className="p-4 rounded-xl border-2 border-secondary-100 hover:border-accent-300 hover:bg-accent-50/50 transition-all text-center"
                >
                  <AlertTriangle className="w-8 h-8 text-accent-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Alertas de Stock</p>
                  <p className="text-xs text-secondary-500 mt-1">Revisar stock bajo</p>
                </button>
                <button
                  onClick={() => runAutomation("analysis")}
                  disabled={automationLoading}
                  className="p-4 rounded-xl border-2 border-secondary-100 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-center"
                >
                  <TrendingUp className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Análisis de Ventas</p>
                  <p className="text-xs text-secondary-500 mt-1">Patrones y tendencias</p>
                </button>
                <button
                  onClick={() => runAutomation("restock")}
                  disabled={automationLoading}
                  className="p-4 rounded-xl border-2 border-secondary-100 hover:border-green-300 hover:bg-green-50/50 transition-all text-center"
                >
                  <RefreshCw className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Reabastecimiento</p>
                  <p className="text-xs text-secondary-500 mt-1">Orden sugerida</p>
                </button>
              </div>

              {automationLoading && (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-3" />
                  <p className="text-sm text-secondary-500">El agente está analizando los datos...</p>
                </div>
              )}

              {automationResult && !automationLoading && (
                <div className="bg-secondary-50 rounded-xl p-5 text-sm space-y-2 border border-secondary-100">
                  <h3 className="font-semibold text-secondary-900">Resultado del Análisis</h3>
                  <div className="text-secondary-700 whitespace-pre-wrap">
                    {automationResult}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-secondary-100 p-5 space-y-3">
              <h3 className="font-semibold text-sm">¿Cómo funciona?</h3>
              <ol className="text-sm text-secondary-600 space-y-2 list-decimal list-inside">
                <li>Selecciona el tipo de análisis</li>
                <li>El agente consulta la base de datos en tiempo real</li>
                <li>Gemini AI procesa los datos y genera recomendaciones</li>
                <li>Recibes un análisis detallado con acciones sugeridas</li>
              </ol>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-5 space-y-2 border border-primary-200">
              <h3 className="font-semibold text-sm text-primary-800">Integración con Gemini AI</h3>
              <p className="text-sm text-primary-700">
                Este agente usa Google Gemini para procesar lenguaje natural y generar insights accionables
                basados en los datos reales de tu base de datos Supabase.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
