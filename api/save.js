import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
    // إعدادات CORS للسماح بالاتصال
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') return response.status(200).end();
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method Not Allowed' });

    try {
        const sql = neon(process.env.DATABASE_URL);
        
        // البيانات القادمة من النموذج في React
        const { name, barcode, purchase_price, sale_price, stock_quantity } = request.body;

        // التحقق من الحقول الأساسية
        if (!name || !purchase_price || !sale_price) {
            return response.status(400).json({ success: false, error: 'يرجى إدخال البيانات الأساسية (الاسم، سعر الشراء، سعر البيع)' });
        }

        // تنفيذ الإدخال في قاعدة بيانات Neon
        const result = await sql`
            INSERT INTO products (
                name, 
                barcode, 
                purchase_price, 
                sale_price, 
                stock_quantity
            ) VALUES (
                ${String(name)}, 
                ${barcode ? String(barcode) : null}, 
                ${parseFloat(purchase_price)}, 
                ${parseFloat(sale_price)}, 
                ${parseInt(stock_quantity || 0)}
            ) RETURNING id;
        `;

        return response.status(200).json({ 
            success: true, 
            message: "تم إضافة المنتج بنجاح", 
            product_id: result[0].id 
        });

    } catch (error) {
        console.error('DATABASE ERROR:', error);
        return response.status(500).json({ 
            success: false, 
            error: 'خطأ في قاعدة البيانات: ' + error.message 
        });
    }
}
