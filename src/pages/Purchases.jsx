import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Truck, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate, today } from '../lib/helpers.js';
import { Button, Input, Badge, Modal, Card, PageHeader, EmptyState } from '../components/ui.jsx';
import { neonService } from '../services/neonService.js';

export default function Purchases() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [invModal, setInvModal] = useState(false);
  const [supModal, setSupModal] = useState(false);
  const [supForm, setSupForm] = useState({ name: '', phone: '' });

  // جلب البيانات من الـ API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await neonService.getPurchases(); // دالة جديدة سنضيفها
        setInvoices(data || []);
      } catch (err) {
        console.error("خطأ في جلب المشتريات:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // إضافة مورد جديد
  const handleAddSupplier = async () => {
    await neonService.addSupplier(supForm);
    setSupModal(false);
    alert("تم إضافة المورد");
  };

  const filtered = invoices.filter((i) =>
    i.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
    (i.supplier_name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <PageHeader
        title="المشتريات"
        subtitle="تسجيل فواتير الموردين"
        actions={
          <>
            <Button variant="secondary" onClick={() => setSupModal(true)}><Truck size={15} />مورد</Button>
            <Button variant="primary" onClick={() => setInvModal(true)}><Plus size={15} />جديد</Button>
          </>
        }
      />

      <div className="relative mb-4">
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن فاتورة أو مورد..."
          className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white" />
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-teal-600" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Truck size={28} />} title="لا توجد فواتير مشتريات" />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-bold text-sm">مورد: {inv.supplier_name}</p>
                  <p className="text-xs text-gray-400">{formatDate(inv.created_at)}</p>
                </div>
                <p className="font-bold text-teal-700">{formatCurrency(inv.total_amount)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={supModal} onClose={() => setSupModal(false)} title="إضافة مورد جديد">
        <div className="space-y-3">
          <Input label="الاسم" value={supForm.name} onChange={(e) => setSupForm({ ...supForm, name: e.target.value })} />
          <Button variant="primary" className="w-full" onClick={handleAddSupplier}>حفظ</Button>
        </div>
      </Modal>
    </div>
  );
}
