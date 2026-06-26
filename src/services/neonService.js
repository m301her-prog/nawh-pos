import { CapacitorHttp } from '@capacitor/core';

const SAVE_URL = "https://nawh-pos-yyre.vercel.app/api/save";
const GET_URL = "https://nawh-pos-yyre.vercel.app/api/get";

export const neonService = {
  
  // --- دوال الجلب الموحدة ---
  async getProducts() {
    const response = await CapacitorHttp.get({ url: GET_URL });
    return response.data;
  },

  async getPurchases() {
    const response = await CapacitorHttp.get({ url: GET_URL });
    return response.data;
  },

  async getSales() {
    const response = await CapacitorHttp.get({ url: GET_URL });
    return response.data;
  },

  async getExpenses() {
    const response = await CapacitorHttp.get({ url: GET_URL });
    return response.data;
  },

  // --- كل عمليات الحفظ موجهة لنفس الرابط ---
  async addProduct(data) {
    const response = await CapacitorHttp.post({
      url: SAVE_URL,
      headers: { 'Content-Type': 'application/json' },
      data: data
    });
    return response.data;
  },

  async addSale(data) {
    const response = await CapacitorHttp.post({
      url: SAVE_URL,
      headers: { 'Content-Type': 'application/json' },
      data: data
    });
    return response.data;
  },

  async addExpense(data) {
    const response = await CapacitorHttp.post({
      url: SAVE_URL,
      headers: { 'Content-Type': 'application/json' },
      data: data
    });
    return response.data;
  },

  async addSupplier(data) {
    const response = await CapacitorHttp.post({
      url: SAVE_URL,
      headers: { 'Content-Type': 'application/json' },
      data: data
    });
    return response.data;
  }
};
