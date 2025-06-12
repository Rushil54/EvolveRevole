export interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  qr_code?: string;
  image_url?: string;
  category: string;
  stock_quantity: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface ScanResult {
  text: string;
  format: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}