import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const productService = {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getProductByBarcode(barcode: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProductByQRCode(qrCode: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('qr_code', qrCode)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStock(productId: string, newQuantity: number) {
    const { data, error } = await supabase
      .from('products')
      .update({ stock_quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .single();
    
    if (error) throw error;
    return data;
  }
};