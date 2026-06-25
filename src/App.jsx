import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, BottomNav } from './components/Layout.jsx';

// التحميل الكسول للصفحات (يمنع حدوث Crash)
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Sales = lazy(() => import('./pages/Sales.jsx'));
const Purchases = lazy(() => import('./pages/Purchases.jsx'));
const Inventory = lazy(() => import('./pages/Inventory.jsx'));
const FinancialReports = lazy(() => import('./pages/FinancialReports.jsx'));
const RecurringInvoices = lazy(() => import('./pages/RecurringInvoices.jsx'));
const EditSales = lazy(() => import('./pages/EditSales.jsx'));
const Expenses = lazy(() => import('./pages/Expenses.jsx'));
const ProfitAnalysis = lazy(() => import('./pages/ProfitAnalysis.jsx'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage.jsx'));
const CustomersPage = lazy(() => import('./pages/CustomersPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pb-20">
        {/* Suspense يعرض هذا النص أثناء تحميل الصفحة لضمان عدم توقف المتصفح */}
        <Suspense fallback={<div className="p-10 text-center">جاري تحميل الصفحة...</div>}>
          {children}
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<FinancialReports />} />
          <Route path="/recurring" element={<RecurringInvoices />} />
          <Route path="/edit-sales" element={<EditSales />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/profit-analysis" element={<ProfitAnalysis />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
