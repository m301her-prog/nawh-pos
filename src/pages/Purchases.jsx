import React, { useState, useEffect } from 'react';
import { Plus, Search, Truck, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/helpers.js';
import { Button, Input, Modal, Card, PageHeader, EmptyState } from '../components/ui.jsx';
import { neonService } from '../services/neonService.js';

export default function Purchases() {
  const [invoices, setInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [supModal, setSupModal] = useState(false);
  const [invModal, setInvModal] = useState(false);
  
  const [supForm, setSupForm] = useState({ name: '', phone: '' });
  const [invForm, setInvForm] = useState({ supplier_id: '', total_amount: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, supRes] = await Promise.all([
        neonService.getPurchases(),
        neonService.getSuppliers()
      ]);
      
      const invData = Array.isArray(invRes) ? invRes : (invRes?.data || invRes?.rows || []);
      const supData = Array.isArray(supRes) ? supRes : (supRes?.data || supRes?.rows || []);
      
      setSuppliers(supData);

      // دمج اسم المورد مع بيانات الفاتورة
      const mergedInvoices = invData.map(inv => ({
        ...inv,
        supplier_name: supData.find(s => String(s.id) === String(inv.supplier_id))?.name || "مورد غير معروف"
      }));
      
      setInvoices(mergedInvoices);
    } catch (err) {
      console.error("خطأ في جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddSupplier = async () => {
    if (!supForm.name) return alert("الرجاء كتابة اسم المورد");
    await neonService.addSupplier(supForm);
    setSupModal(false);
    setSupForm({ name: '', phone: '' });
    fetchData();
  };

  const handleAddInvoice = async () => {
    if (!invForm.supplier_id || !invForm.total_amount) return alert("الرجاء تعبئة بيانات الفاتورة");
    await neonService.addPurchase(invForm);
    setInvModal(false);
    setInvForm({ supplier_id: '', total_amount: '' });
    fetchData();
  };

  const filtered = invoices.filter((i) =>
    (i?.supplier_name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <PageHeader
        title="المشتريات"
        subtitle="تسجيل فواتير الموردين"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setSupModal(true)}><Truck size={15} /> مورد</Button>
            <Button variant="primary" onClick={() => setInvModal(true)}><Plus size={15} /> فاتورة جديد</Button>
          </div>
        }
      />

      <div className="relative mb-4">
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث باسم المورد..."
          className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white" />
      </div>

      <Card>
        {loading ? <div className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-teal-600" /></div> :
         filtered.length === 0 ? <EmptyState icon={<Truck size={28} />} title="لا توجد فواتير" /> :
         <div className="divide-y divide-gray-100">
            {filtered.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-bold text-sm">مورد: {inv.supplier_name}</p>
                  <p className="text-xs text-gray-400">{inv.created_at ? formatDate(inv.created_at) : 'تاريخ غير متوفر'}</p>
                </div>
                <p className="font-bold text-teal-700">{formatCurrency(inv.total_amount)}</p>
              </div>
            ))}
         </div>
        }
      </Card>

      <Modal isOpen={supModal} onClose={() => setSupModal(false)} title="إضافة مورد">
        <Input label="الاسم" value={supForm.name} onChange={(e) => setSupForm({...supForm, name: e.target.value})} />
        <Input label="الهاتف" value={supForm.phone} onChange={(e) => setSupForm({...supForm, phone: e.target.value})} />
        <Button onClick={handleAddSupplier} className="w-full mt-3">حفظ المورد</Button>
      </Modal>

      <Modal isOpen={invModal} onClose={() => setInvModal(false)} title="تسجيل فاتورة">
        <div className="space-y-3">
          <label className="text-sm font-bold block">المورد</label>
          <select className="w-full p-2 border rounded" value={invForm.supplier_id} onChange={(e) => setInvForm({...invForm, supplier_id: e.target.value})}>
            <option value="">اختر مورد...</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <Input label="المبلغ" type="number" value={invForm.total_amount} onChange={(e) => setInvForm({...invForm, total_amount: e.target.value})} />
          <Button onClick={handleAddInvoice} className="w-full">حفظ الفاتورة</Button>
        </div>
      </Modal>
    </div>
  );
}
