import React, { useState } from 'react';
import { Plus, Search, Edit2, Package, AlertTriangle, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../lib/helpers.js';
import { Button, Input, Select, Badge, Modal, Card, EmptyState, PageHeader } from '../components/ui.jsx';

const UNITS = ['قطعة', 'كيلو', 'لتر', 'علبة', 'كرتون', 'كيس', 'زجاجة', 'درزن'];
const EMPTY = { barcode: '', name: '', category_id: '', unit: 'قطعة', cost_price: '', sell_price: '', stock_qty: '0', min_stock_qty: '5', notes: '' };

// مصفوفات فارغة لضمان عدم حدوث خطأ
const MOCK_PRODUCTS = [];
const MOCK_CATEGORIES = [];

export default function Inventory() {
  const [products] = useState(MOCK_PRODUCTS);
  const [categories] = useState(MOCK_CATEGORIES);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [adjModal, setAdjModal] = useState(false);
  const [adjProduct, setAdjProduct] = useState(null);
  const [adjQty, setAdjQty] = useState('');

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.barcode ?? '').includes(search);
    const matchCat = !filterCat || p.category_id === filterCat;
    const matchLow = !lowOnly || p.stock_qty <= p.min_stock_qty;
    return matchSearch && matchCat && matchLow;
  });

  const lowCount = products.filter((p) => p.stock_qty <= p.min_stock_qty).length;
  const stockValue = products.reduce((s, p) => s + p.stock_qty * p.cost_price, 0);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <PageHeader
        title="المخزون"
        subtitle="إدارة المنتجات والأصناف"
        actions={<Button variant="primary" onClick={() => { setEditItem(null); setForm(EMPTY); setModalOpen(true); }}><Plus size={15} />منتج جديد</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'إجمالي الأصناف', value: products.length, color: 'text-teal-700 bg-teal-50' },
          { label: 'مخزون منخفض', value: lowCount, color: 'text-amber-700 bg-amber-50' },
          { label: 'قيمة المخزون', value: formatCurrency(stockValue), color: 'text-emerald-700 bg-emerald-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color.split(' ')[1]}`}>
            <p className="text-gray-500 text-xs mb-1">{s.label}</p>
            <p className={`font-bold text-base ${s.color.split(' ')[0]}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex-1 relative min-w-40">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث بالاسم أو الباركود..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 bg-white" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white">
          <option value="">جميع الفئات</option>
        </select>
        <button onClick={() => setLowOnly(!lowOnly)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white">
          <AlertTriangle size={13} /> مخزون منخفض
        </button>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={<Package size={28} />} title="لا توجد منتجات" description="أضف منتجاً للبدء" />
        ) : (
          <div className="overflow-x-auto">
             {/* الجدول يظهر هنا عند توفر بيانات */}
          </div>
        )}
      </Card>

      {/* Modals: تم الاحتفاظ بالهيكل لسهولة الإضافة لاحقاً */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'تعديل منتج' : 'إضافة منتج'} size="lg">
         {/* حقول الإدخال هنا */}
      </Modal>
    </div>
  );
}
