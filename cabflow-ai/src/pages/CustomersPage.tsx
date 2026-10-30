import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Customer } from '../types';
import { AddCustomerModal } from '../components/AddCustomerModal';
import {
  UserCheck,
  Search,
  Plus,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { t, addToast, triggerRefresh, refreshTrigger, user } = useApp();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getCustomers(search)
      .then(setCustomers)
      .catch((e) => addToast('Failed to load customers', 'error'))
      .finally(() => setIsLoading(false));
  }, [search, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (user?.role === 'viewer') {
      addToast('Viewers have read-only access.', 'error');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await api.deleteCustomer(id);
      addToast(`Customer ${id} deleted`, 'info');
      triggerRefresh();
    } catch (err: any) {
      addToast(err.message || 'Cannot delete customer', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.customers.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.customers.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all hover:scale-102 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.customers.addCustomer}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.customers.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t.customers.name}</th>
                <th className="py-3 px-4">{t.customers.phone}</th>
                <th className="py-3 px-4">{t.customers.email}</th>
                <th className="py-3 px-4">{t.customers.address}</th>
                <th className="py-3 px-4">{t.customers.totalRides}</th>
                <th className="py-3 px-4">{t.customers.totalSpent}</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {customers.length > 0 ? (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div>{c.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800 whitespace-nowrap">
                      {c.phone}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.email || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[180px] truncate" title={c.address}>
                      {c.address || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                      <span>{c.totalRides ?? 0} rides</span>
                      <span className="text-slate-400 text-[10px] ml-1">({c.completedRides ?? 0} comp)</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-700 tabular-nums whitespace-nowrap">
                      ₹{(c.totalSpent ?? 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(c.id)}
                        title="Delete customer"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    {t.common.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCustomerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
