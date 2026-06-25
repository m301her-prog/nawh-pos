import React, { useState } from 'react';
import { TrendingUp, DollarSign, BarChart3, Package } from 'lucide-react';
import { formatCurrency } from '../lib/helpers.js';
import { Card, Button, PageHeader } from '../components/ui.jsx';

const PERIODS = [
  { value: 'month', label: 'هذا الشهر' },
  { value: 'quarter', label: 'هذا الربع' },
  { value: 'year', label: 'هذا العام' },
];

// بيانات تجريبية ثابتة لعرض واجهة المستخدم
const MOCK_DATA = {
  totalRevenue: 25000,
  totalPurchases: 10000,
  totalExpenses: 3000,
  totalDiscounts: 500,
  costOfGoods: 8000,
  grossProfit: 16500,
  netProfit: 13500,
  grossMargin: 66,
  netMargin: 54,
  productMargins: [
    { name: 'منتج أ', qty: 10, revenue: 5000, cost: 2000, profit: 3000, margin: 60 }
  ]
};

export default function ProfitAnalysis() {
  const [period, setPeriod] = useState('month');
  const [data] = useState(MOCK_DATA);

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-5">
      <PageHeader title="تحليل الربح والمكسب" subtitle="لوحة تحكم الأرباح (بيانات تجريبية)" />

      {/* Period Selector */}
      <div className="flex gap-2">
        {PERIODS.map((p) => (
          <button key={p.value} onClick={() => setPeriod(p.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${period === p.value ? 'bg-teal-700 text-white' : 'bg-white border text-gray-600'}`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي الإيرادات', value: formatCurrency(data.totalRevenue), gradient: 'from-teal-600 to-teal-800' },
          { label: 'تكلفة البضاعة', value: formatCurrency(data.costOfGoods), gradient: 'from-violet-600 to-violet-800' },
          { label: 'الربح الإجمالي', value: formatCurrency(data.grossProfit), gradient: 'from-emerald-600 to-emerald-800' },
          { label: 'صافي الربح', value: formatCurrency(data.netProfit), gradient: 'from-amber-500 to-amber-700' },
        ].map((item) => (
          <div key={item.label} className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-5 text-white`}>
            <p className="text-white/80 text-xs mb-1">{item.label}</p>
            <p className="font-bold text-xl">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Margin Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 text-center">
          <p className="text-gray-500 text-sm mb-2">هامش الربح الإجمالي</p>
          <span className="text-2xl font-bold text-teal-700">{data.grossMargin}%</span>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-gray-500 text-sm mb-2">هامش الربح الصافي</p>
          <span className="text-2xl font-bold text-emerald-700">{data.netMargin}%</span>
        </Card>
      </div>

      {/* P&L breakdown */}
      <Card className="p-5">
        <h3 className="font-bold text-gray-800 text-sm mb-4">قائمة الأرباح والخسائر</h3>
        <p className="text-sm text-gray-500">سيتم عرض تفاصيل التكاليف والأرباح هنا عند ربطها بقاعدة البيانات.</p>
      </Card>
    </div>
  );
}
