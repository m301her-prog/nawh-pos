import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, Loader2 } from 'lucide-react';
import { formatCurrency } from '../lib/helpers.js';
import { Button, Input, Modal, Card, PageHeader, EmptyState } from '../components/ui.jsx';
import { neonService } from '../services/neonService.js';

const EMPTY = { name: '', barcode: '', purchase_price: '', sale_price: '', stock_quantity: '0' };

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  // جلب المنتجات
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await neonService.getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("خطأ في جلب المخزون:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // حفظ منتج جديد
  const handleSave = async () => {
    try {
      // إرسال البيانات للخدمة
      const newProduct = await neonService.addProduct(form);
      if (newProduct) {
        setProducts([...products, newProduct]);
        setModalOpen(false);
        setForm(EMPTY); // تصفير النموذج
      }
    } catch (err) {
      console.error("خطأ في حفظ المنتج:", err);
      alert("فشل حفظ المنتج، تأكد من إدخال البيانات بشكل صحيح");
    }
  };

  const filtered = products.filter((p) => 
    (p.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (p.barcode?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <PageHeader
        title="المخزون"
        subtitle="إدارة المنتجات والأصناف"
        actions={<Button variant="primary" onClick={() => setModalOpen(true)}><Plus size={15} />منتج جديد</Button>}
      />

      <div className="relative mb-4">
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="ابحث بالاسم أو الباركود..."
          className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white" 
        />
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-teal-600" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Package size={28} />} title="لا توجد منتجات" />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <div key={p.id} className="flex justify-between items-center p-4 text-sm">
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-xs text-gray-400">باركود: {p.barcode || 'غير متوفر'}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-teal-700">{formatCurrency(p.sale_price)}</p>
                  <p className="text-xs text-gray-500">الكمية: {p.stock_quantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="إضافة منتج جديد">
        <div className="space-y-3">
          <Input label="اسم المنتج" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="الباركود" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
          <Input label="سعر الشراء" type="number" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} />
          <Input label="سعر البيع" type="number" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
          <Input label="الكمية الافتتاحية" type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
          <Button variant="primary" className="w-full" onClick={handleSave}>حفظ المنتج</Button>
        </div>
      </Modal>
    </div>
  );
}
