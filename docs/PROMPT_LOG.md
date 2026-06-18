# Bitácora de Prompts (Prompt Log)

## Proyecto: Leandro Baterías - Sistema de Control de Inventario con IA Agéntica

---

## 1. Generación de Esquema de Base de Datos

### System Prompt para Prisma Schema (Google AI Studio)

```prompt
Eres un experto en diseño de bases de datos relacionales y Prisma ORM.
Genera un schema de Prisma para un sistema de e-commerce de baterías automotrices con los siguientes requisitos:

Negocio: Tienda "Leandro Baterías" en Cusco, Perú.
Vende baterías de 6 marcas: Capsa, Solite, Varta, Ultrabat, Etna, Enerjet.

Requisitos:
- Gestión de productos con especificaciones técnicas (voltaje, capacidad, CCA, bornes)
- Control de inventario con stock mínimo y movimientos
- Órdenes de compra con múltiples items
- Facturación electrónica (Boletas y Facturas)
- Métodos de pago: Yape, Plin, Tarjeta, Efectivo
- Carrito de compras para clientes
- Usuarios con roles (ADMIN, CUSTOMER)

Usa PostgreSQL, incluye relaciones, enums, timestamps y decoradores @id, @default, @relation.
```

### Resultado:
Schema completo de Prisma con 9 modelos: User, Brand, Category, Product, Order, OrderItem, Invoice, CartItem, InventoryMovement.

---

## 2. Generación de Endpoints del Backend

### System Prompt para API Routes

```prompt
Genera API Routes en Next.js 14+ (App Router) para un sistema de e-commerce de baterías.

Modelos principales:
- Product (name, slug, sku, price, stock, minStock, specs, brandId, categoryId)
- Order (orderNumber, customerName, customerEmail, subtotal, tax, total, status, paymentMethod)
- OrderItem (orderId, productId, quantity, unitPrice, subtotal)
- InventoryMovement (productId, quantity, type, reference)

Endpoints necesarios:
1. GET /api/products - listar con filtros por brand y category
2. POST /api/products - crear producto
3. PUT /api/products/[id] - actualizar
4. DELETE /api/products/[id] - desactivar
5. GET /api/brands - listar marcas
6. GET /api/orders - listar órdenes
7. POST /api/orders - crear orden (descuenta stock, crea invoice)
8. POST /api/inventory/movement - registro de movimiento de inventario

Usa Prisma Client, manejo de errores try/catch, respuestas JSON estandarizadas.
```

---

## 3. Agente Residente (LeoBot) - System Prompt

```prompt
Eres 'LeoBot', el asistente inteligente de Leandro Baterías, una tienda de baterías automotrices en Cusco, Perú.

Tus funciones son:
1. Analizar el inventario y dar insights sobre productos, stock, y tendencias de ventas.
2. Predecir necesidades de reabastecimiento basado en el stock actual y ventas históricas.
3. Generar reportes de ventas y rendimiento en lenguaje natural claro y profesional.
4. Responder preguntas sobre productos, marcas (Capsa, Solite, Varta, Ultrabat, Etna, Enerjet) y especificaciones técnicas.
5. Recomendar acciones para optimizar el inventario basado en datos de la base de datos.

Siempre responde en español, de forma clara, profesional y amigable.
Usa datos concretos cuando los tengas disponibles.
Si no tienes suficiente información, sé honesto y pide más detalles.
```

### Prompts de contexto inyectados al agente residente:

```prompt
DATOS ACTUALES DEL SISTEMA:
[Se inyectan datos en tiempo real de la base de datos Supabase]

=== INVENTARIO ===
Total de productos: {count}
Stock total: {totalStock}
Valor total del inventario: S/. {valor}
Productos con stock bajo: {count}
Marcas disponibles: {brands}

=== VENTAS (últimos 30 días) ===
Total de ventas: {count}
Ingresos totales: S/. {total}
Productos más vendidos: {topProducts}
```

---

## 4. Agente de Automatización - System Prompt

```prompt
Eres el Agente de Automatización de Leandro Baterías.
Tus responsabilidades son:
1. Monitorear el inventario y generar alertas cuando productos estén por debajo del stock mínimo.
2. Generar recomendaciones de reabastecimiento.
3. Analizar patrones de compra para sugerir promociones.
4. Preparar reportes para ser enviados por correo electrónico.

Responde en español, con recomendaciones accionables y específicas.
```

### Prompt para análisis de stock bajo:

```prompt
Genera alertas de reabastecimiento para los siguientes productos con stock bajo:
{lista de productos con stock bajo}

Para cada producto, recomienda:
1. Cantidad sugerida a pedir
2. Urgencia (ALTA/MEDIA/BAJA)
3. Proveedor potencial
```

### Prompt para análisis de patrones de venta:

```prompt
Analiza los siguientes patrones de venta de la última semana:
{datos de ventas por marca y producto}

Genera:
1. Análisis de tendencias de compra
2. Recomendaciones de promociones basadas en los datos
3. Sugerencias de cross-selling
4. Estrategias de precios para la próxima semana
```

---

## 5. Prompts para Generación de UI/Components

### System Prompt para componentes React (Frontend)

```prompt
Genera componentes React con Tailwind CSS para un e-commerce de baterías automotrices.
Estilo: limpio, profesional, colores claros (azul primario), similar a Google Material Design.
Idioma: Español.

Componentes necesarios:
1. Header con navegación y carrito
2. ProductCard con imagen, specs, precio, botón add-to-cart
3. CartSidebar con resumen y checkout
4. AdminDashboard con cards de métricas
5. Tablas de productos/órdenes con búsqueda
6. Formulario de checkout con métodos de pago (Yape, Plin, Tarjeta, Efectivo)

Usa Lucide icons, estados de carga, manejo de errores con toast notifications.
```

---

## 6. Correcciones Post-Generación (Human-in-the-loop)

### Problemas detectados y soluciones:

| # | Problema (Alucinación/Error) | Corrección Aplicada |
|---|------------------------------|---------------------|
| 1 | La IA generó `prisma.product.fields.minStock` como referencia directa | Se mantuvo porque Prisma 6 lo soporta para queries |
| 2 | La IA usó `map` en lugar de `Promise.all` para creación masiva en seed | Se cambió a `Promise.all` para operaciones paralelas |
| 3 | Faltaban tipos TypeScript para las props de componentes | Se agregaron interfaces en `src/types/index.ts` |
| 4 | La IA generó la ruta de API duplicada | Se reorganizó la estructura de carpetas de API routes |
| 5 | El agente Gemini podía alucinar datos si no tenía contexto | Se agregó inyección de datos reales de BD en cada consulta |
| 6 | Manejo incorrecto de `searchParams` en Next.js 15 | Se actualizó a la sintaxis async correcta |

---

## 7. Prompt para Configuración de Despliegue (Vercel + Supabase)

```prompt
Genera configuración para desplegar una aplicación Next.js en Vercel con Supabase como base de datos.

Requisitos:
- Prisma ORM conectado a Supabase PostgreSQL
- Variables de entorno en Vercel
- Scripts de migración en package.json
- Archivo vercel.json con configuración de builds

Las variables de entorno necesarias:
- DATABASE_URL (conexión a Supabase PostgreSQL)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- GEMINI_API_KEY (para Google AI Studio)
```

---

## Resumen de Tecnologías Utilizadas

| Tecnología | Propósito | Rol de la IA |
|-----------|-----------|--------------|
| Google Gemini AI | Agente Residente + Automatización | Generación de insights, análisis, predicciones |
| Next.js 15 | Frontend + Backend API | Generación de componentes y API routes |
| Prisma ORM | Modelado de datos | Generación de schema y migraciones |
| Supabase | Base de datos PostgreSQL | Almacenamiento gestionado por IA |
| Vercel | Hosting y despliegue | Configuración de CI/CD |
| Tailwind CSS | Diseño UI | Generación de estilos y componentes |
