import React, { useState, useEffect } from 'react';
import { Search, Eye, X, Edit3, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/helpers.js';
import { Button, Badge, Card, EmptyState, PageHeader } from '../components/ui.jsx';
import { neonService } from '../services/neonService.js';

export default function EditSales() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ payment_method: '', notes: '' });

  // جلب الفواتير من قاعدة البيانات
  useEffect(() => {
    async function fetchInvoices() {
      try {
        setLoading(true);
        const res = await neonService.getSales(); // الدالة التي استحدثناها
        setInvoices(res.data || []);
      } catch (err) {
        console.error("خطأ في جلب الفواتير:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  const handleUpdate = async () => {
    try {
      // هنا تستدعي خدمة تحديث الفاتورة (تحتاج لإضافتها في neonService)
      await neonService.updateSale(selected.id, editForm);
      setEditModal(false);
      // تحديث القائمة بعد التعديل
      window.location.reload(); 
    } catch (err) {
      alert("فشل التعديل");
    }
  };

  const filtered = invoices.filter((i) => {
    const matchSearch = i.id.toString().includes(search) || (i.customer_name?.toLowerCase() || '').includes(search.toLowerCase());
    const matchStatus = !status || i.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <PageHeader title="تعديل المبيعات" subtitle="مراجعة وتعديل فواتير البيع" />

      {/* أدوات البحث */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث برقم الفاتورة..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 bg-white" />
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-teal-600" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Edit3 size={28} />} title="لا توجد فواتير" />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div>
                  <p className="font-bold">فاتورة #{inv.id}</p>
                  <p className="text-xs text-gray-500">{formatDate(inv.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => { setSelected(inv); setViewModal(true); }}>
                    <Eye size={16} />
                  </Button>
                  <Button variant="ghost" onClick={() => { setSelected(inv); setEditModal(true); }}>
                    <Edit3 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* ملاحظة: منطق الـ Modal يظل كما هو مع استبدال البيانات بـ selected */}
    </div>
  );
}
