import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Package, Loader2, Camera, X } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { formatCurrency } from '../lib/helpers.js';
import { Button, Input, Modal, Card, PageHeader, EmptyState } from '../components/ui.jsx';
import { neonService } from '../services/neonService.js';

const EMPTY = { name: '', barcode: '', purchase_price: '', sale_price: '', stock_quantity: '0' };

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false); // لحالة الكاميرا
  const [form, setForm] = useState(EMPTY);
  const scannerRef = useRef(null);

  // تشغيل الكاميرا
  const startScanner = () => {
    setScannerOpen(true);
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
      scanner.render((decodedText) => {
        setForm({ ...form, barcode: decodedText });
        setScannerOpen(false);
        scanner.clear();
      });
    }, 100);
  };

  // ... (باقي دوال الـ useEffect والـ handleSave كما هي)

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* ... (باقي الواجهة) */}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="إضافة منتج جديد">
        <div className="space-y-3">
          <Input label="اسم المنتج" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          
          {/* حقل الباركود مع زر الكاميرا */}
          <div className="relative">
            <Input label="الباركود" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
            <Button variant="secondary" className="absolute left-0 top-7" onClick={startScanner}>
              <Camera size={16} />
            </Button>
          </div>

          {/* نافذة الكاميرا */}
          {scannerOpen && (
            <div className="fixed inset-0 z-50 bg-black p-4 flex flex-col items-center justify-center">
              <div id="reader" className="w-full max-w-sm bg-white"></div>
              <Button onClick={() => setScannerOpen(false)} className="mt-4"><X size={16} /> إغلاق</Button>
            </div>
          )}

          {/* زر توليد باركود عشوائي */}
          <Button variant="outline" className="w-full text-xs" onClick={() => setForm({...form, barcode: Math.floor(Math.random() * 1000000000000).toString()})}>
            توليد باركود تلقائي
          </Button>

          <Input label="سعر الشراء" type="number" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} />
          <Input label="سعر البيع" type="number" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
          <Input label="الكمية" type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
          <Button variant="primary" className="w-full" onClick={handleSave}>حفظ المنتج</Button>
        </div>
      </Modal>
    </div>
  );
}
