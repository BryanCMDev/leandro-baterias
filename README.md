# Leandro Baterías - Sistema de Gestión de Inventario con IA

## 📋 Descripción

Sistema completo de e-commerce y control de inventario para **Leandro Baterías**, una tienda de baterías automotrices en Cusco, Perú. Desarrollado con arquitectura de agentes de IA.

### Marcas Disponibles
🔋 Capsa | Solite | Varta | Ultrabat | Etna | Enerjet

## 🏗️ Arquitectura del Sistema

```
Frontend (Next.js + Tailwind) ──► API Routes (Next.js) ──► Supabase (PostgreSQL)
                                    │
                                    └──► Google Gemini AI (Agentes IA)
```

### Componentes Principales

- **Frontend**: Next.js 15, React 19, Tailwind CSS, TypeScript
- **Backend**: Next.js API Routes (App Router)
- **Base de Datos**: Supabase (PostgreSQL) con Prisma ORM
- **Agentes IA**: Google Gemini AI (Vertex AI)

## 🤖 Funcionalidad Agéntica (Requisito del Curso)

### 1. Agente Residente - LeoBot
- Chat interactivo que responde preguntas sobre inventario en lenguaje natural
- Análisis de tendencias de ventas y stock
- Generación automática de reportes semanales
- Predicción de necesidades de reabastecimiento

### 2. Agente de Automatización
- Monitoreo continuo de niveles de stock
- Alertas automáticas de productos con stock bajo
- Recomendaciones de reabastecimiento
- Análisis de patrones de compra

## 🚀 Características

### Tienda Online
- Catálogo de productos con filtros por marca
- Carrito de compras
- Checkout con Yape, Plin, Tarjeta, Efectivo
- Diseño responsive estilo Google

### Panel Admin
- Dashboard con métricas en tiempo real
- CRUD de productos
- Gestión de órdenes (cambio de estado)
- Control de inventario con movimientos
- Agente IA integrado

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/leandro-baterias.git

# Instalar dependencias
cd leandro-baterias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Configurar base de datos (Prisma + Supabase)
npx prisma generate
npx prisma db push
npx prisma db seed

# Iniciar servidor de desarrollo
npm run dev
```

## 🔧 Variables de Entorno

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
GEMINI_API_KEY="tu-api-key-de-gemini"
```

## 🌐 Despliegue

### Vercel + Supabase

```bash
# 1. Crear proyecto en Supabase y obtener credenciales
# 2. Conectar repositorio GitHub con Vercel
# 3. Agregar variables de entorno en Vercel
# 4. Configurar migraciones de Prisma
```

## 📁 Estructura del Proyecto

```
leandro-baterias/
├── docs/               # Documentación
│   ├── ARCHITECTURE.txt
│   └── PROMPT_LOG.md
├── prisma/             # Schema BD y seed
├── src/
│   ├── agents/         # Lógica de agentes IA
│   ├── app/            # Next.js App Router (páginas + API)
│   ├── components/     # Componentes React
│   ├── context/        # Contextos (carrito)
│   ├── lib/            # Utilidades (Prisma, Gemini, Supabase)
│   └── types/          # Tipos TypeScript
```

## 📊 Base de Datos

Modelos: User, Brand, Category, Product, Order, OrderItem, Invoice, CartItem, InventoryMovement

## 👥 Créditos

Proyecto desarrollado para el curso de **Desarrollo de Software con Agentes de IA**.
Tecnologías: Next.js, Supabase, Prisma, Google Gemini AI, Vercel.
