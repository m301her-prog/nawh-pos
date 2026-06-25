import React, { useState } from 'react';
import { Plus, Search, Trash2, Calendar } from 'lucide-react';
import { formatCurrency, formatDate, today } from '../lib/helpers.js';
import { Button, Input, Select, Badge, Modal, Card, EmptyState, PageHeader } from '../components/ui.jsx';

// مصفوفات فارغة للبيانات لضمان عمل الواجهة بدون أخطاء
const MOCK_CATEGORIES = [];
const MOCK_EXPENSES = [];

export default function Expenses() {
  const [expenses] = useState(MOCK_EXPENSES);
  const [categories] = useState(MOCK_CATEGORIES);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    category: '', description: '', amount: '',
    expense_date: today(), payment_method: 'نقداً', notes: '',
  });

  const filtered = expenses.filter((e) => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) || e.category.includes(search);
    const matchCat = !filterCat || e.category === filterCat;
    const matchFrom = !dateFrom || e.expense_date >= dateFrom;
    const matchTo = !dateTo || e.expense_date <= dateTo;
    return matchSearch && matchCat && matchFrom && matchTo;
  });

  const todayStr = today();
  const monthStr = todayStr.slice(0, 7);
  const todayTotal = expenses.filter((e) => e.expense_date === todayStr).reduce((s, e) => s + e.amount, 0);
  const monthTotal = expenses.filter((e) => e.expense_date.startsWith(monthStr)).reduce((s, e) => s + e.amount, 0);
  const filtTotal = filtered.reduce((s, e) => s + e.amount, 0);

  const CAT_COLORS = { 'إيجار': 'blue', 'كهرباء': 'yellow', 'مياه': 'blue', 'رواتب': 'green', 'تسويق': 'orange', 'صيانة': 'gray', 'مواصلات': 'gray', 'أخرى': 'gray' };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <PageHeader
        title="المصروفات"
        subtitle="سجل النفقات التشغيلية اليومية"
        actions={<Button variant="primary" onClick={() => setModalOpen(true)}><Plus size={15} />مصروف جديد</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'مصروفات اليوم', value: formatCurrency(todayTotal), color: 'text-red-700 bg-red-50' },
          { label: 'مصروفات الشهر', value: formatCurrency(monthTotal), color: 'text-orange-700 bg-orange-50' },
          { label: 'مجموع الفترة', value: formatCurrency(filtTotal), color: 'text-blue-700 bg-blue-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color.split(' ')[1]}`}>
            <p className="text-gray-500 text-xs mb-1">{s.label}</p>
            <p className={`font-bold text-base ${s.color.split(' ')[0]}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex-1 relative min-w-40">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 bg-white" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white">
          <option value="">جميع الفئات</option>
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white" />
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={<Calendar size={28} />} title="لا توجد مصروفات" description="سجّل مصروف جديد" />
        ) : (
          <div className="overflow-x-auto">
             {/* الجدول يظهر هنا في حال وجود بيانات لاحقاً */}
          </div>
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="إضافة مصروف" size="sm">
        <div className="space-y-3">
          <Select label="الفئة *" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">اختر الفئة</option>
          </Select>
          <Input label="البيان *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="المبلغ *" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Button variant="primary" className="w-full" onClick={() => setModalOpen(false)}>حفظ</Button>
        </div>
      </Modal>
    </div>
  );
}
