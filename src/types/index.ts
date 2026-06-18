export interface ProductWithBrand extends Product {
  brand: Brand;
  category: Category;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  specs: any;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  imageUrl: string | null;
  isActive: boolean;
  voltage: string | null;
  capacity: string | null;
  cca: string | null;
  terminalType: string | null;
  warranty: string | null;
  brandId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerAddress: string | null;
  customerDoc: string | null;
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
  invoice: Invoice | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: Product;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  type: string;
  subtotal: number;
  tax: number;
  total: number;
  pdfUrl: string | null;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "YAPE" | "PLIN" | "CARD" | "CASH";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface CartItemWithProduct {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  quantity: number;
  type: "IN" | "OUT" | "ADJUSTMENT";
  reference: string | null;
  notes: string | null;
  createdAt: string;
  product: Product;
}

export interface AgentMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface AgentInsight {
  summary: string;
  recommendations: string[];
  analysis: string;
  timestamp: string;
}
