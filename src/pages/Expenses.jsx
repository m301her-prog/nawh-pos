import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate, today } from '../lib/helpers.js';
import { Button, Input, Modal, Card, EmptyState, PageHeader } from '../components/ui.jsx';
import { neonService } from '../services/neonService.js';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    category: 'عام', 
    description: '', 
    amount: '',
    expense_date: today(), 
    payment_method: 'نقداً', 
    notes: '',
  });

  // جلب البيانات عند التحميل
  useEffect(() => {
    async function loadExpenses() {
      try {
        setLoading(true);
        const data = await neonService.getExpenses();
        setExpenses(data || []);
      } catch (err) {
        console.error("خطأ في جلب المصروفات:", err);
      } finally {
        setLoading(false);
      }
    }
    loadExpenses();
  }, []);

  // إضافة مصروف وتحديث القائمة محلياً
  const handleSave = async () => {
    try {
      const newExpense = await neonService.addExpense(form);
      if (newExpense) {
        setExpenses([...expenses, newExpense]);
        setModalOpen(false);
        setForm({ ...form, description: '', amount: '' }); // إعادة تعيين النموذج
      }
    } catch (err) {
      console.error("خطأ في حفظ المصروف:", err);
      alert("حدث خطأ أثناء حفظ المصروف");
    }
  };

  const filtered = expenses.filter((e) => {
    const desc = e.description?.toLowerCase() || '';
    const cat = e.category?.toLowerCase() || '';
    return desc.includes(search.toLowerCase()) || cat.includes(search.toLowerCase());
  });

  // الحسابات المالية
  const todayStr = today();
  const todayTotal = filtered
    .filter((e) => e.expense_date === todayStr)
    .reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
    
  const filtTotal = filtered.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <PageHeader
        title="المصروفات"
        subtitle="سجل النفقات التشغيلية اليومية"
        actions={<Button variant="primary" onClick={() => setModalOpen(true)}><Plus size={15} />مصروف جديد</Button>}
      />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl p-4 text-center bg-red-50">
          <p className="text-gray-500 text-xs mb-1">مصروفات اليوم</p>
          <p className="font-bold text-base text-red-700">{formatCurrency(todayTotal)}</p>
        </div>
        <div className="rounded-xl p-4 text-center bg-blue-50">
          <p className="text-gray-500 text-xs mb-1">المجموع الكلي</p>
          <p className="font-bold text-base text-blue-700">{formatCurrency(filtTotal)}</p>
        </div>
      </div>

      <div className="mb-4 relative">
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="ابحث عن مصروف..."
          className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 bg-white" 
        />
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-teal-600" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Calendar size={28} />} title="لا توجد مصروفات" />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((e) => (
              <div key={e.id} className="flex justify-between p-4 text-sm">
                <div>
                    <p className="font-medium">{e.description}</p>
                    <p className="text-xs text-gray-400">{formatDate(e.expense_date)}</p>
                </div>
                <span className="font-bold text-red-600">{formatCurrency(e.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="إضافة مصروف" size="sm">
        <div className="space-y-3">
          <Input 
            label="البيان" 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
          />
          <Input 
            label="المبلغ" 
            type="number" 
            value={form.amount} 
            onChange={(e) => setForm({ ...form, amount: e.target.value })} 
          />
          <Button variant="primary" className="w-full" onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </div>
  );
}
