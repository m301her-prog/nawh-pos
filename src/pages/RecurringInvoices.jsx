import React, { useState } from 'react';
import { Plus, RefreshCw, Eye, Clock } from 'lucide-react';
import { formatCurrency, today } from '../lib/helpers.js';
import { Button, Modal, Card, PageHeader, EmptyState, Badge } from '../components/ui.jsx';

const INTERVALS = [
  { value: 'daily', label: 'يومي' },
  { value: 'weekly', label: 'أسبوعي' },
  { value: 'monthly', label: 'شهري' },
];

export default function RecurringInvoices() {
  const [createModal, setCreateModal] = useState(false);
  const [invoices] = useState([]); // بيانات تجريبية فارغة حالياً

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <PageHeader
        title="الفواتير الدائمة"
        subtitle="إدارة فواتير البيع المتكررة (واجهة تجريبية)"
        actions={<Button variant="primary" onClick={() => setCreateModal(true)}><Plus size={15} />فاتورة دائمة جديدة</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {['إجمالي الفواتير الدائمة', 'فواتير نشطة', 'متأخرة'].map((label) => (
          <div key={label} className="rounded-xl p-4 text-center bg-gray-50 border border-gray-100">
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className="font-bold text-2xl text-gray-700">0</p>
          </div>
        ))}
      </div>

      <Card>
        {invoices.length === 0 ? (
          <EmptyState 
            icon={<RefreshCw size={28} />} 
            title="لا توجد فواتير دائمة" 
            description="يمكنك إنشاء فاتورة متكررة من خلال زر 'فاتورة دائمة جديدة'" 
          />
        ) : (
          <div className="overflow-x-auto">
            {/* الجدول سيظهر هنا عند إضافة بيانات */}
          </div>
        )}
      </Card>

      {/* Modal - هيكل جاهز */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="إنشاء فاتورة دائمة" size="xl">
        <p className="text-sm text-gray-500 p-4">هذه الواجهة جاهزة لربطها بمدخلاتك البرمجية.</p>
        <div className="flex justify-end p-4 border-t">
          <Button variant="secondary" onClick={() => setCreateModal(false)}>إغلاق</Button>
        </div>
      </Modal>
    </div>
  );
}
