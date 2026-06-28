import React, { useState, useEffect } from 'react';
import { Plus, Search, Truck, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/helpers.js';
import { Button, Input, Modal, Card, PageHeader, EmptyState, Select } from '../components/ui.jsx';
import { neonService } from '../services/neonService.js';

export default function Purchases() {
  const [invoices, setInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // قائمة الموردين
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [supModal, setSupModal] = useState(false);
  const [invModal, setInvModal] = useState(false);
  
  const [supForm, setSupForm] = useState({ name: '', phone: '' });
  const [invForm, setInvForm] = useState({ supplier_id: '', total_amount: '' });

  // دالة تحميل البيانات الموحدة
  const fetchData = async () => {
    setLoading(true);
    try {
      const [invData, supData] = await Promise.all([
        neonService.getPurchases(),
        neonService.getSuppliers() // تأكد من وجود هذه الدالة في خدمتك
      ]);
      setInvoices(Array.isArray(invData) ? invData : []);
      setSuppliers(Array.isArray(supData) ? supData : []);
    } catch (err) {
      console.error("خطأ في جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddSupplier = async () => {
    await neonService.addSupplier(supForm);
    setSupModal(false);
    setSupForm({ name: '', phone: '' });
    fetchData(); // تحديث القائمة بعد الإضافة
  };

  const handleAddInvoice = async () => {
    await neonService.addPurchase(invForm); // تأكد من وجود دالة إضافة فاتورة
    setInvModal(false);
    setInvForm({ supplier_id: '', total_amount: '' });
    fetchData(); // تحديث القائمة بعد الإضافة
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

      {/* ... (باقي كود البحث والـ Card كما هي) ... */}

      {/* مودال المورد */}
      <Modal isOpen={supModal} onClose={() => setSupModal(false)} title="إضافة مورد">
        <Input label="الاسم" value={supForm.name} onChange={(e) => setSupForm({...supForm, name: e.target.value})} />
        <Input label="الهاتف" value={supForm.phone} onChange={(e) => setSupForm({...supForm, phone: e.target.value})} />
        <Button onClick={handleAddSupplier} className="w-full mt-3">حفظ المورد</Button>
      </Modal>

      {/* مودال فاتورة الشراء */}
      <Modal isOpen={invModal} onClose={() => setInvModal(false)} title="تسجيل فاتورة">
        <div className="space-y-3">
          <label className="text-sm font-medium">اختر المورد</label>
          <select 
            className="w-full p-2 border rounded"
            value={invForm.supplier_id} 
            onChange={(e) => setInvForm({...invForm, supplier_id: e.target.value})}
          >
            <option value="">اختر مورد...</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <Input label="المبلغ الإجمالي" type="number" value={invForm.total_amount} onChange={(e) => setInvForm({...invForm, total_amount: e.target.value})} />
          <Button onClick={handleAddInvoice} className="w-full">حفظ الفاتورة</Button>
        </div>
      </Modal>
    </div>
  );
}
