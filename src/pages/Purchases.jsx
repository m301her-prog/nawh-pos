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
    try {
      // جلب الموردين أولاً ثم الفواتير
      const [invRes, supRes] = await Promise.all([
        neonService.getPurchases(),
        neonService.getSuppliers()
      ]);
      
      // معالجة البيانات (تأكد من شكل البيانات العائدة من السيرفر)
      const invData = Array.isArray(invRes) ? invRes : (invRes?.data || invRes?.rows || []);
      const supData = Array.isArray(supRes) ? supRes : (supRes?.data || supRes?.rows || []);
      
      console.log("الموردين المجلوبين:", supData); // للتحقق من وصول البيانات
      
      setSuppliers(supData);
      
      const enrichedInvoices = invData.map(inv => ({
        ...inv,
        supplier_name: supData.find(s => String(s.id) === String(inv.supplier_id))?.name || "مورد غير معروف"
      }));
      
      setInvoices(enrichedInvoices);
    } catch (err) {
      console.error("خطأ في جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleAddSupplier = async () => {
    if (!supForm.name) return alert("الرجاء كتابة اسم المورد");
    try {
      await neonService.addSupplier(supForm);
      setSupModal(false);
      setSupForm({ name: '', phone: '' });
      // استدعاء fetchData مرة أخرى فوراً لجلب القائمة المحدثة
      await fetchData(); 
    } catch (err) {
      alert("خطأ أثناء حفظ المورد");
    }
  };

  const handleAddInvoice = async () => {
    if (!invForm.supplier_id || !invForm.total_amount) return alert("الرجاء تعبئة بيانات الفاتورة");
    try {
      await neonService.addPurchase(invForm);
      setInvModal(false);
      setInvForm({ supplier_id: '', total_amount: '' });
      await fetchData();
    } catch (err) {
      alert("خطأ أثناء حفظ الفاتورة");
    }
  };

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

      {/* مودال إضافة المورد */}
      <Modal isOpen={supModal} onClose={() => setSupModal(false)} title="إضافة مورد">
        <Input label="الاسم" value={supForm.name} onChange={(e) => setSupForm({...supForm, name: e.target.value})} />
        <Input label="الهاتف" value={supForm.phone} onChange={(e) => setSupForm({...supForm, phone: e.target.value})} />
        <Button onClick={handleAddSupplier} className="w-full mt-3">حفظ المورد</Button>
      </Modal>

      {/* مودال إضافة فاتورة */}
      <Modal isOpen={invModal} onClose={() => setInvModal(false)} title="تسجيل فاتورة">
        <div className="space-y-3">
          <label className="text-sm font-bold block">اختر المورد</label>
          <select 
            className="w-full p-2 border rounded bg-white" 
            value={invForm.supplier_id} 
            onChange={(e) => setInvForm({...invForm, supplier_id: e.target.value})}
          >
            <option value="">اختر مورد...</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <Input label="المبلغ" type="number" value={invForm.total_amount} onChange={(e) => setInvForm({...invForm, total_amount: e.target.value})} />
          <Button onClick={handleAddInvoice} className="w-full">حفظ الفاتورة</Button>
        </div>
      </Modal>

      <Card>
        {loading ? <div className="py-10 text-center"><Loader2 className="animate-spin mx-auto" /></div> :
         suppliers.length === 0 ? <p className="p-4 text-center text-gray-500">لا يوجد موردين مسجلين</p> : null
        }
        {/* ... (باقي كود عرض الفواتير كما كان) */}
      </Card>
    </div>
  );
}
