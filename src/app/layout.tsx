import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Leandro Baterías | Tienda de Baterías Automotrices en Cusco",
  description:
    "Venta de baterías automotrices en Cusco, Perú. Marcas: Capsa, Solite, Varta, Ultrabat, Etna, Enerjet. Envíos a domicilio.",
  keywords: "baterías, Cusco, automotriz, Capsa, Solite, Varta, batería de auto",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-secondary-50 text-secondary-900">
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartSidebar />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#fff",
                color: "#1e293b",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "14px",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
