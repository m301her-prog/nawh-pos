import React, { useState } from 'react';
import { Plus, Search, Eye, Truck } from 'lucide-react';
import { formatCurrency, formatDate, today } from '../lib/helpers.js';
import { Button, Input, Select, Badge, Modal, Card, PageHeader, EmptyState } from '../components/ui.jsx';

// بيانات تجريبية ثابتة
const MOCK_INVOICES = []; 
const MOCK_SUPPLIERS = [];
const MOCK_PRODUCTS = [];

export default function Purchases() {
  const [invoices] = useState(MOCK_INVOICES);
  const [suppliers] = useState(MOCK_SUPPLIERS);
  const [products] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [invModal, setInvModal] = useState(false);
  const [supModal, setSupModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [lines, setLines] = useState([{ product_id: '', quantity: '', unit_cost: '' }]);
  const [form, setForm] = useState({ supplier_id: '', invoice_date: today(), paid_amount: '', payment_status: 'unpaid', notes: '' });
  const [supForm, setSupForm] = useState({ name: '', phone: '', address: '' });

  const filtered = invoices.filter((i) =>
    i.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
    ((i.supplier)?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (s) => {
    if (s === 'paid') return <Badge color="green">مدفوع</Badge>;
    if (s === 'partial') return <Badge color="yellow">جزئي</Badge>;
    return <Badge color="red">غير مدفوع</Badge>;
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <PageHeader
        title="المشتريات"
        subtitle="تسجيل فواتير الموردين (واجهة تجريبية)"
        actions={
          <>
            <Button variant="secondary" onClick={() => setSupModal(true)}><Truck size={15} />إضافة مورد</Button>
            <Button variant="primary" onClick={() => setInvModal(true)}><Plus size={15} />فاتورة جديدة</Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {['إجمالي الفواتير', 'الموردون', 'إجمالي المشتريات'].map((label, i) => (
          <div key={label} className="rounded-xl p-4 text-center bg-gray-50 border border-gray-100">
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className="font-bold text-base text-gray-700">0</p>
          </div>
        ))}
      </div>

      <div className="relative mb-4">
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن فاتورة أو مورد..."
          className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white" />
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={<Truck size={28} />} title="لا توجد فواتير مشتريات حالياً" />
        ) : (
          <div className="overflow-x-auto">
             {/* الجدول يظهر هنا عند توفر بيانات */}
          </div>
        )}
      </Card>

      {/* Modals: الهيكل جاهز للربط لاحقاً */}
      <Modal isOpen={invModal} onClose={() => setInvModal(false)} title="فاتورة مشتريات جديدة" size="xl">
        {/* محتوى الفاتورة */}
      </Modal>

      <Modal isOpen={supModal} onClose={() => setSupModal(false)} title="إضافة مورد جديد" size="sm">
        <div className="space-y-3">
          <Input label="الاسم" value={supForm.name} onChange={(e) => setSupForm({ ...supForm, name: e.target.value })} />
          <Button variant="primary" className="w-full">حفظ المورد</Button>
        </div>
      </Modal>
    </div>
  );
}
