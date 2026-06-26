import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate, today } from '../lib/helpers.js';
import { Button, Input, Select, Badge, Modal, Card, EmptyState, PageHeader } from '../components/ui.jsx';
import { neonService } from '../services/neonService.js';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    category: '', description: '', amount: '',
    expense_date: today(), payment_method: 'نقداً', notes: '',
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

  const handleSave = async () => {
    await neonService.addExpense(form);
    setModalOpen(false);
    window.location.reload(); // تحديث الصفحة لرؤية البيانات الجديدة
  };

  const filtered = expenses.filter((e) => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) || e.category.includes(search);
    const matchCat = !filterCat || e.category === filterCat;
    const matchFrom = !dateFrom || e.expense_date >= dateFrom;
    const matchTo = !dateTo || e.expense_date <= dateTo;
    return matchSearch && matchCat && matchFrom && matchTo;
  });

  // الحسابات المالية (محدثة بناءً على البيانات القادمة من السيرفر)
  const todayStr = today();
  const todayTotal = filtered.filter((e) => e.expense_date === todayStr).reduce((s, e) => s + parseFloat(e.amount), 0);
  const filtTotal = filtered.reduce((s, e) => s + parseFloat(e.amount), 0);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <PageHeader
        title="المصروفات"
        subtitle="سجل النفقات التشغيلية اليومية"
        actions={<Button variant="primary" onClick={() => setModalOpen(true)}><Plus size={15} />مصروف جديد</Button>}
      />

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'مصروفات اليوم', value: formatCurrency(todayTotal), color: 'text-red-700 bg-red-50' },
          { label: 'المجموع الكلي', value: formatCurrency(filtTotal), color: 'text-blue-700 bg-blue-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color.split(' ')[1]}`}>
            <p className="text-gray-500 text-xs mb-1">{s.label}</p>
            <p className={`font-bold text-base ${s.color.split(' ')[0]}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex-1 relative min-w-40">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 bg-white" />
        </div>
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
                    <span>{e.description}</span>
                    <span className="font-bold text-red-600">{formatCurrency(e.amount)}</span>
                </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="إضافة مصروف" size="sm">
        <div className="space-y-3">
          <Input label="البيان" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="المبلغ" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Button variant="primary" className="w-full" onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>
    </div>
  );
}
