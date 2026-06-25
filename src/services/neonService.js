// src/services/neonService.js
// تأكد من تثبيت مكتبة pg: npm install pg
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: import.meta.env.VITE_DATABASE_URL, // يوضع رابط قاعدة البيانات في ملف .env
});

export const neonService = {
  // جلب إجمالي الأرباح للتقارير
  async getFinancialReport() {
    try {
      const result = await pool.query(`
        SELECT 
          (SELECT SUM(total_price) FROM sales_invoices) as total_sales,
          (SELECT SUM(amount) FROM expenses) as total_expenses
      `);
      return result.rows[0];
    } catch (error) {
      console.error("خطأ في جلب التقارير:", error);
      throw error;
    }
  },

  // إضافة عملية بيع جديدة
  async addSale(saleData) {
    const { total_price, payment_method } = saleData;
    const query = 'INSERT INTO sales_invoices (total_price, payment_method) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [total_price, payment_method]);
    return result.rows[0];
  }
};
