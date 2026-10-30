import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Payment } from '../types';
import {
  CreditCard,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { t, openRecordPayment, addToast, refreshTrigger } = useApp();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getPayments({ search, status: statusFilter, method: methodFilter })
      .then(setPayments)
      .catch((e) => addToast('Failed to load payments', 'error'))
      .finally(() => setIsLoading(false));
  }, [search, statusFilter, methodFilter, refreshTrigger]);

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'UPI':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Card':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cash':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'NetBanking':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.payments.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.payments.subtitle}
          </p>
        </div>

        <button
          onClick={() => openRecordPayment()}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all hover:scale-102 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.payments.recordPayment}</span>
        </button>
      </div>

      {/* College Demonstration Notice */}
      <div className="p-4 bg-purple-50/80 border border-purple-200/80 rounded-2xl flex items-start gap-3 text-xs text-purple-900 leading-relaxed shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Course Demonstration Notice: </span>
          <span>{t.payments.demoNotice}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payment ID, booking, customer, reference..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="all">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
            <option value="NetBanking">Net Banking</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t.payments.paymentId}</th>
                <th className="py-3 px-4">{t.payments.bookingId}</th>
                <th className="py-3 px-4">{t.payments.customerName}</th>
                <th className="py-3 px-4">{t.payments.amount}</th>
                <th className="py-3 px-4">{t.payments.method}</th>
                <th className="py-3 px-4">{t.payments.reference}</th>
                <th className="py-3 px-4">{t.payments.date}</th>
                <th className="py-3 px-4 text-right">{t.payments.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {p.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-700 font-semibold whitespace-nowrap">
                      {p.booking_id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold whitespace-nowrap">
                      {p.customer_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getMethodBadge(p.method)}`}>
                        {p.method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{p.transaction_ref}</span>
                        {p.is_demo && (
                          <span className="px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded text-[9px] uppercase font-bold">
                            Demo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(p.payment_date).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    {t.common.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
