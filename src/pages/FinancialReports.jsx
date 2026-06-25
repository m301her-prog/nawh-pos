import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Truck, Receipt, Package } from 'lucide-react';
import { formatCurrency } from '../lib/helpers.js';
import { Card, Button, PageHeader } from '../components/ui.jsx';

const PERIODS = [
  { value: 'today', label: 'اليوم' },
  { value: 'week', label: 'هذا الأسبوع' },
  { value: 'month', label: 'هذا الشهر' },
  { value: 'year', label: 'هذا العام' },
];

// بيانات تجريبية ثابتة لتظهر الواجهة بشكل سليم
const MOCK_DATA = {
  totalSales: 15000,
  totalPurchases: 5000,
  totalExpenses: 2000,
  netProfit: 8000,
  salesCount: 45,
  avgSale: 333,
  topProducts: [{ name: 'منتج أ', revenue: 5000 }, { name: 'منتج ب', revenue: 3000 }],
  topExpCats: [{ category: 'إيجار', total: 1500 }, { category: 'كهرباء', total: 500 }],
  dailySales: [{ date: '2026-06-20', total: 2000 }, { date: '2026-06-21', total: 3500 }]
};

export default function FinancialReports() {
  const [period, setPeriod] = useState('month');
  const [data] = useState(MOCK_DATA); // بيانات ثابتة

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-5">
      <PageHeader title="التقارير الحسابية" subtitle="أرباح وخسائر ومؤشرات الأداء (بيانات تجريبية)" />

      {/* Period selector */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button key={p.value} onClick={() => setPeriod(p.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${period === p.value ? 'bg-teal-700 text-white' : 'bg-white border text-gray-600'}`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'إجمالي المبيعات', value: formatCurrency(data.totalSales), gradient: 'from-teal-600 to-teal-800' },
          { label: 'إجمالي المشتريات', value: formatCurrency(data.totalPurchases), gradient: 'from-violet-600 to-violet-800' },
          { label: 'المصروفات', value: formatCurrency(data.totalExpenses), gradient: 'from-red-500 to-red-700' },
          { label: 'صافي الربح', value: formatCurrency(data.netProfit), gradient: 'from-emerald-600 to-emerald-800' },
          { label: 'عدد الفواتير', value: String(data.salesCount), gradient: 'from-blue-600 to-blue-800' },
          { label: 'متوسط الفاتورة', value: formatCurrency(data.avgSale), gradient: 'from-cyan-600 to-cyan-800' },
        ].map((item) => (
          <div key={item.label} className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-4 text-white`}>
            <p className="text-white/80 text-xs mb-1">{item.label}</p>
            <p className="font-bold text-base">{item.value}</p>
          </div>
        ))}
      </div>

      {/* باقي الأقسام يمكن تركها كما هي لأنها تعتمد على نفس كائن data */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-800 text-sm mb-4">تحليل الربحية</h3>
        {/* يمكنك إضافة الرسوم البيانية هنا باستخدام كائن data */}
        <p className="text-sm text-gray-500">هذه هي لوحة التقارير، يمكنك تحديث البيانات لاحقاً.</p>
      </Card>
    </div>
  );
}
