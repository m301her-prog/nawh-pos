import React, { useState } from 'react';
import { Store, Bell, Printer } from 'lucide-react';
import { Card, PageHeader } from '../components/ui.jsx';

const SETTINGS_SECTIONS = [
  {
    title: 'معلومات المتجر',
    icon: <Store size={18} className="text-teal-600" />,
    items: [
      { label: 'اسم المتجر', value: 'اسم المتجر', type: 'text' },
      { label: 'رقم الهاتف', value: '0500000000', type: 'text' },
      { label: 'العنوان', value: 'العنوان', type: 'text' },
    ],
  },
  {
    title: 'الإشعارات',
    icon: <Bell size={18} className="text-amber-500" />,
    items: [
      { label: 'تنبيه المخزون المنخفض', value: true, type: 'toggle' },
      { label: 'تنبيه الفواتير الدائمة', value: true, type: 'toggle' },
    ],
  },
  {
    title: 'الطباعة',
    icon: <Printer size={18} className="text-blue-500" />,
    items: [
      { label: 'الطابعة الافتراضية', value: 'Thermal Printer', type: 'text' },
      { label: 'طباعة تلقائية بعد البيع', value: false, type: 'toggle' },
    ],
  },
];

export default function SettingsPage() {
  const [values, setValues] = useState({
    'اسم المتجر': 'محل عامية', 'رقم الهاتف': '0500000000', 'العنوان': 'المملكة العربية السعودية',
    'تنبيه المخزون المنخفض': true, 'تنبيه الفواتير الدائمة': true,
    'الطابعة الافتراضية': 'Thermal Printer', 'طباعة تلقائية بعد البيع': false,
  });

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <PageHeader title="الإعدادات" subtitle="ضبط إعدادات النظام" />

      {SETTINGS_SECTIONS.map((section) => (
        <Card key={section.title}>
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            {section.icon}
            <h3 className="font-bold text-gray-700 text-sm">{section.title}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {section.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3">
                <label className="text-gray-700 text-sm">{item.label}</label>
                {item.type === 'toggle' ? (
                  <button
                    onClick={() => setValues((v) => ({ ...v, [item.label]: !v[item.label] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${values[item.label] ? 'bg-teal-600' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${values[item.label] ? 'left-5' : 'left-0.5'}`} />
                  </button>
                ) : (
                  <input
                    value={values[item.label] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [item.label]: e.target.value }))}
                    className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-teal-400 w-44 text-right"
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
