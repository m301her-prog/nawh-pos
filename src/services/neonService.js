// src/services/neonService.js
import { CapacitorHttp } from '@capacitor/core';

const BASE_URL = "https://nawh-pos-yyre.vercel.app/api";

export const neonService = {
  
  // 1. جلب التقارير المالية
  async getFinancialReport() {
    try {
      const response = await CapacitorHttp.get({
        url: `${BASE_URL}/get` // الرابط الخاص بالجلب
      });
      return response.data;
    } catch (error) {
      console.error("خطأ في جلب التقارير:", error);
      throw error;
    }
  },

  // 2. إضافة عملية بيع (مربوطة بجدول sales_invoices و sale_items)
  // هذا يتوافق مع منطق الإدخال في الـ Schema الخاصة بك
  async addSale(saleData) {
    try {
      const response = await CapacitorHttp.post({
        url: `${BASE_URL}/save`, // الرابط الخاص بالحفظ
        headers: { 'Content-Type': 'application/json' },
        data: {
          total_price: saleData.total_price,
          payment_method: saleData.payment_method,
          items: saleData.items // مصفوفة الأصناف [{product_id, quantity, price}, ...]
        }
      });
      return response.data;
    } catch (error) {
      console.error("خطأ في إضافة البيع:", error);
      throw error;
    }
  },

  // 3. جلب المنتجات (للمخزون)
  async getProducts() {
    try {
      const response = await CapacitorHttp.get({
        url: `${BASE_URL}/get-products` // يفترض وجود هذا المسار في الـ API الخاص بك
      });
      return response.data;
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
      throw error;
    }
  }
};
