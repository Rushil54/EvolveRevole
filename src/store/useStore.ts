import { create } from 'zustand';
import { CartItem, Product, Cart } from '../types';

interface StoreState {
  cart: Cart;
  products: Product[];
  isScanning: boolean;
  scanResult: string | null;
  
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Product actions
  setProducts: (products: Product[]) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  
  // Scanner actions
  setIsScanning: (scanning: boolean) => void;
  setScanResult: (result: string | null) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  cart: { items: [], total: 0 },
  products: [],
  isScanning: false,
  scanResult: null,

  addToCart: (product: Product, quantity = 1) => {
    const { cart } = get();
    const existingItem = cart.items.find(item => item.product.id === product.id);
    
    let newItems: CartItem[];
    if (existingItem) {
      newItems = cart.items.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newItems = [...cart.items, { product, quantity }];
    }
    
    const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    set({ cart: { items: newItems, total } });
  },

  removeFromCart: (productId: string) => {
    const { cart } = get();
    const newItems = cart.items.filter(item => item.product.id !== productId);
    const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    set({ cart: { items: newItems, total } });
  },

  updateQuantity: (productId: string, quantity: number) => {
    const { cart } = get();
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    const newItems = cart.items.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    );
    const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    set({ cart: { items: newItems, total } });
  },

  clearCart: () => {
    set({ cart: { items: [], total: 0 } });
  },

  setProducts: (products: Product[]) => {
    set({ products });
  },

  updateProductStock: (productId: string, newStock: number) => {
    const { products } = get();
    const updatedProducts = products.map(product =>
      product.id === productId
        ? { ...product, stock_quantity: newStock }
        : product
    );
    set({ products: updatedProducts });
  },

  setIsScanning: (scanning: boolean) => {
    set({ isScanning: scanning });
  },

  setScanResult: (result: string | null) => {
    set({ scanResult: result });
  }
}));