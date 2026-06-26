import { CapacitorHttp } from '@capacitor/core';

const SAVE_URL = "https://nawh-pos-yyre.vercel.app/api/save";
const GET_URL = "https://nawh-pos-yyre.vercel.app/api/get";

export const neonService = {
  
  // --- دوال الجلب (تمت إضافة الـ action في الـ params) ---
  async getProducts() {
    const response = await CapacitorHttp.get({ url: `${GET_URL}?action=products` });
    return response.data;
  },

  async getPurchases() {
    const response = await CapacitorHttp.get({ url: `${GET_URL}?action=purchases` });
    return response.data;
  },

  async getSales() {
    const response = await CapacitorHttp.get({ url: `${GET_URL}?action=sales` });
    return response.data;
  },

  async getExpenses() {
    const response = await CapacitorHttp.get({ url: `${GET_URL}?action=expenses` });
    return response.data;
  },

  // --- دوال الحفظ (تم توحيد الهيكل: { action, data }) ---
  async addProduct(data) {
    return this.postData('add_product', data);
  },

  async addSale(data) {
    return this.postData('add_sale', data);
  },

  async addExpense(data) {
    return this.postData('add_expense', data);
  },

  async addSupplier(data) {
    return this.postData('add_supplier', data);
  },

  // دالة مساعدة لتوحيد عملية الإرسال
  async postData(action, data) {
    const response = await CapacitorHttp.post({
      url: SAVE_URL,
      headers: { 'Content-Type': 'application/json' },
      data: { action, data } // الهيكل المتوافق مع الباك إند
    });
    return response.data;
  }
};
