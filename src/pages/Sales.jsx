import React, { useState } from 'react';
import { Search, ScanLine, ShoppingBag, CheckCircle, Tag } from 'lucide-react';
import { formatCurrency } from '../lib/helpers.js';
import { Button, Input, Select, Modal, Card, Spinner, EmptyState, PageHeader } from '../components/ui.jsx';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'نقداً' },
  { value: 'card', label: 'بطاقة' },
  { value: 'transfer', label: 'تحويل بنكي' },
  { value: 'credit', label: 'آجل' },
];

export default function Sales() {
  const [cart] = useState([]); // سلة فارغة
  const [products] = useState([]); // منتجات فارغة للواجهة
  const [loading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [customerName, setCustomerName] = useState('عميل نقدي');

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <PageHeader title="نقطة البيع" subtitle="إنشاء فواتير بيع (واجهة تجريبية)" />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* ── Products panel ── */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="ابحث عن منتج أو استخدم الباركود..." className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" />
            </div>
            <div className="relative">
              <ScanLine size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500" />
              <input className="w-32 pr-9 pl-3 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-sm" placeholder="باركود..." />
            </div>
          </div>

          <Card>
            {loading ? <div className="py-12 text-center"><Spinner size={36} /></div> : 
             <EmptyState icon={<ShoppingBag size={28} />} title="لا توجد منتجات للعرض حالياً" />}
          </Card>
        </div>

        {/* ── Cart ── */}
        <div className="w-full lg:w-80 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-4 bg-teal-900 rounded-t-2xl text-white font-bold text-sm">السلة</div>
          <div className="p-4 space-y-3">
            <Input label="اسم العميل" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <Select label="طريقة الدفع">
              {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </Select>
            <Button variant="primary" className="w-full" onClick={() => setSuccessModal(true)}>إتمام البيع</Button>
          </div>
        </div>
      </div>

      <Modal isOpen={successModal} onClose={() => setSuccessModal(false)} title="تمت العملية بنجاح">
        <div className="text-center py-4">
          <CheckCircle size={48} className="text-teal-600 mx-auto mb-4" />
          <p>تم إتمام عملية البيع بنجاح.</p>
        </div>
      </Modal>
    </div>
  );
}
