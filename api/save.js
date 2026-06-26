// src/services/neonService.js
import { CapacitorHttp } from '@capacitor/core';

const BASE_API = "https://nawh-pos-yyre.vercel.app/api";

export const neonService = {
  
  // --- دوال الجلب ---
  // قمت بإضافة الـ action في الـ params ليعرف السيرفر أي جدول يطلب
  async getProducts() {
    const response = await CapacitorHttp.get({ url: `${BASE_API}/get?action=products` });
    return response.data;
  },

  async getPurchases() {
    const response = await CapacitorHttp.get({ url: `${BASE_API}/get?action=purchases` });
    return response.data;
  },

  async getSales() {
    const response = await CapacitorHttp.get({ url: `${BASE_API}/get?action=sales` });
    return response.data;
  },

  async getExpenses() {
    const response = await CapacitorHttp.get({ url: `${BASE_API}/get?action=expenses` });
    return response.data;
  },

  // --- دوال الحفظ ---
  // تمت إضافة action لكل دالة ليعرف السيرفر أي جدول يستهدف
  async addProduct(data) {
    const response = await CapacitorHttp.post({
      url: `${BASE_API}/save`,
      headers: { 'Content-Type': 'application/json' },
      data: { ...data, action: 'add_product' }
    });
    return response.data;
  },

  async addSale(data) {
    const response = await CapacitorHttp.post({
      url: `${BASE_API}/save`,
      headers: { 'Content-Type': 'application/json' },
      data: { ...data, action: 'add_sale' }
    });
    return response.data;
  },

  async addExpense(data) {
    const response = await CapacitorHttp.post({
      url: `${BASE_API}/save`,
      headers: { 'Content-Type': 'application/json' },
      data: { ...data, action: 'add_expense' }
    });
    return response.data;
  },

  async addSupplier(data) {
    const response = await CapacitorHttp.post({
      url: `${BASE_API}/save`,
      headers: { 'Content-Type': 'application/json' },
      data: { ...data, action: 'add_supplier' }
    });
    return response.data;
  }
};
