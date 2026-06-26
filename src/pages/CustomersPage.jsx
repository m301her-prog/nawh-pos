import React, { useState, useEffect } from 'react';
import { Search, User, Phone, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/helpers.js';
import { Card, EmptyState, PageHeader } from '../components/ui.jsx';
import { neonService } from '../services/neonService.js'; // استدعاء الخدمة

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); // حالة التحميل

  // جلب العملاء عند فتح الصفحة
  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        // نفترض وجود دالة getCustomers في neonService
        const data = await neonService.getCustomers(); 
        setCustomers(data);
      } catch (error) {
        console.error("خطأ في جلب العملاء:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone ?? '').includes(search)
  );

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <PageHeader title="العملاء" subtitle="قائمة العملاء وسجل مشترياتهم" />
      
      <div className="relative mb-4">
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="ابحث عن عميل..."
          className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 bg-white" 
        />
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={30} className="animate-spin text-teal-600" />
          </div>
        ) : customers.length === 0 ? (
          <EmptyState icon={<User size={28} />} title="لا يوجد عملاء مسجلين" />
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
                  {c.phone && <p className="text-gray-400 text-xs flex items-center gap-1"><Phone size={10} />{c.phone}</p>}
                  <p className="text-gray-400 text-xs">آخر شراء: {formatDate(c.last_purchase_date)}</p>
                </div>
                <div className="text-left">
                  <p className="text-teal-700 font-bold text-sm">{formatCurrency(c.total_spent)}</p>
                  <p className="text-gray-400 text-xs">{c.invoices_count} فاتورة</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
