import { neon } from '@neondatabase/serverless';

// هذا هو "التصدير الافتراضي" الذي يبحث عنه Vercel
export default async function handler(req, res) {
    // 1. إعدادات CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const sql = neon(process.env.DATABASE_URL);
        const { action, ...data } = req.body;

        // التوجيه بناءً على الـ action الذي أرسلناه من neonService
        if (action === 'add_product') {
            const { name, barcode, purchase_price, sale_price, stock_quantity } = data;
            await sql`INSERT INTO products (name, barcode, purchase_price, sale_price, stock_quantity) 
                      VALUES (${name}, ${barcode || null}, ${parseFloat(purchase_price)}, ${parseFloat(sale_price)}, ${parseInt(stock_quantity || 0)})`;
            return res.status(200).json({ success: true, message: "تم إضافة المنتج" });
        }
        
        // أضف هنا باقي الـ actions (add_sale, add_expense, إلخ) بنفس الطريقة
        
        return res.status(400).json({ success: false, error: 'Action غير معروف' });

    } catch (error) {
        console.error('DATABASE ERROR:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
