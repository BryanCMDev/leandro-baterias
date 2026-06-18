"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Battery, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Credenciales inválidas");
      toast.success("Inicio de sesión exitoso");
      router.push("/admin");
    } catch {
      toast.error("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl border border-secondary-100 p-8 space-y-6 shadow-sm">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary-50 rounded-xl">
            <Battery className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-xl font-bold text-secondary-900">Iniciar Sesión</h1>
          <p className="text-sm text-secondary-500">Panel de administración</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Contraseña" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            <Lock className="w-4 h-4 mr-2" /> Ingresar
          </Button>
        </form>
        <p className="text-xs text-secondary-400 text-center">
          Demo: admin@leandrobaterias.com / admin123
        </p>
      </div>
    </div>
  );
}
