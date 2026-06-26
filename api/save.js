import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
    // إعدادات CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') return response.status(200).end();
    if (request.method !== 'POST') {
        return response.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);
        
        // استخراج البيانات من الطلب
        // total_price: إجمالي الفاتورة
        // payment_method: نوع الدفع (كاش/آجل)
        // items: مصفوفة تحتوي { product_id, quantity, price }
        const { total_price, payment_method, items } = request.body;

        if (!total_price || !items || !Array.isArray(items) || items.length === 0) {
            return response.status(400).json({ success: false, error: 'بيانات الفاتورة غير مكتملة' });
        }

        // تنفيذ العمليات داخل Transaction لضمان سلامة البيانات
        const result = await sql.transaction(async (tx) => {
            
            // 1. إدراج رأس الفاتورة في جدول sales_invoices
            const invoice = await tx`
                INSERT INTO sales_invoices (total_price, payment_method) 
                VALUES (${parseFloat(total_price)}, ${String(payment_method)}) 
                RETURNING id;
            `;
            
            const invoiceId = invoice[0].id;

            // 2. إدراج كل صنف في جدول sale_items وتحديث المخزون في products
            for (const item of items) {
                // إدراج تفاصيل الصنف
                await tx`
                    INSERT INTO sale_items (invoice_id, product_id, quantity, price) 
                    VALUES (${invoiceId}, ${item.product_id}, ${parseInt(item.quantity)}, ${parseFloat(item.price)})
                `;
                
                // تحديث المخزون (خصم الكمية المباعة)
                await tx`
                    UPDATE products 
                    SET stock_quantity = stock_quantity - ${parseInt(item.quantity)} 
                    WHERE id = ${item.product_id}
                `;
            }
            return invoiceId;
        });

        return response.status(200).json({ 
            success: true, 
            message: "تم تسجيل الفاتورة وتحديث المخزون بنجاح",
            invoice_id: result
        });

    } catch (error) {
        console.error('DATABASE TRANSACTION ERROR:', error);
        return response.status(500).json({ 
            success: false, 
            error: 'خطأ في النظام المحاسبي: ' + error.message 
        });
    }
}
