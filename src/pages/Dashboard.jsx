import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Package, Truck, Receipt, BarChart3, 
  RefreshCw, Edit3, TrendingUp, Activity 
} from 'lucide-react';

const GRID_CARDS = [
  { path: '/sales', title: 'المبيعات', desc: 'إدارة الفواتير', gradient: 'from-teal-600 to-teal-800', Icon: ShoppingCart },
  { path: '/purchases', title: 'المشتريات', desc: 'تسجيل الموردين', gradient: 'from-violet-600 to-violet-800', Icon: Truck },
  { path: '/inventory', title: 'المخزون', desc: 'إدارة الأصناف', gradient: 'from-amber-500 to-amber-700', Icon: Package },
  { path: '/reports', title: 'التقارير', desc: 'أرباح وخسائر', gradient: 'from-cyan-600 to-cyan-800', Icon: BarChart3 },
  { path: '/recurring', title: 'فواتير دائمة', desc: 'فواتير متكررة', gradient: 'from-orange-500 to-orange-700', Icon: RefreshCw },
  { path: '/edit-sales', title: 'تعديل المبيعات', desc: 'مراجعة الفواتير', gradient: 'from-blue-600 to-blue-800', Icon: Edit3 },
  { path: '/expenses', title: 'المصروفات', desc: 'نفقات تشغيلية', gradient: 'from-red-500 to-red-700', Icon: Receipt },
  { path: '/profit-analysis', title: 'تحليل الربح', desc: 'تحليل المكسب', gradient: 'from-emerald-600 to-emerald-800', Icon: TrendingUp },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">لوحة التحكم</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GRID_CARDS.map((card) => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            className={`p-6 rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg hover:scale-105 transition-all`}
          >
            <card.Icon size={32} className="mb-3" />
            <h2 className="font-bold text-lg">{card.title}</h2>
            <p className="text-sm opacity-80">{card.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
