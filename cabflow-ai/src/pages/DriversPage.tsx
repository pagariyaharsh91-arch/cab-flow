import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Driver } from '../types';
import { AddDriverModal } from '../components/AddDriverModal';
import {
  Users,
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';

export const DriversPage: React.FC = () => {
  const { t, addToast, triggerRefresh, refreshTrigger, user } = useApp();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getDrivers({ search, status: statusFilter })
      .then(setDrivers)
      .catch((e) => addToast('Failed to load drivers', 'error'))
      .finally(() => setIsLoading(false));
  }, [search, statusFilter, refreshTrigger]);

  const handleStatusChange = async (id: string, newStatus: any) => {
    if (user?.role === 'viewer') {
      addToast('Viewers have read-only access.', 'error');
      return;
    }
    try {
      await api.updateDriver(id, { status: newStatus });
      addToast(`Driver duty status updated`, 'success');
      triggerRefresh();
    } catch (err: any) {
      addToast(err.message || 'Failed to update driver', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (user?.role === 'viewer') {
      addToast('Viewers have read-only access.', 'error');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this driver?')) return;
    try {
      await api.deleteDriver(id);
      addToast(`Driver ${id} removed`, 'info');
      triggerRefresh();
    } catch (err: any) {
      addToast(err.message || 'Cannot delete driver', 'error');
    }
  };

  const isExpirySoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;
    return expiry - now <= ninetyDays && expiry - now > 0;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'on_duty':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'off_duty':
        return 'bg-slate-100 text-slate-700 border-slate-200';
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
            {t.drivers.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.drivers.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all hover:scale-102 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.drivers.addDriver}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.drivers.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="all">All Duty Statuses</option>
            <option value="available">Available</option>
            <option value="on_duty">On Trip / Duty</option>
            <option value="off_duty">Off Duty</option>
          </select>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t.drivers.driverName}</th>
                <th className="py-3 px-4">{t.drivers.phone}</th>
                <th className="py-3 px-4">{t.drivers.licenseNo}</th>
                <th className="py-3 px-4">{t.drivers.expiry}</th>
                <th className="py-3 px-4">{t.drivers.dutyStatus}</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {drivers.length > 0 ? (
                drivers.map((d) => {
                  const expiring = isExpirySoon(d.license_expiry);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                            {d.name.charAt(0)}
                          </div>
                          <div>
                            <div>{d.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{d.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="text-slate-800">{d.phone}</div>
                        {d.email && <div className="text-slate-400 text-[10px]">{d.email}</div>}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 uppercase">
                        {d.license_number}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="flex items-center gap-1.5">
                          <span>{d.license_expiry}</span>
                          {expiring && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>{t.drivers.expiryWarning}</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={d.status}
                          onChange={(e) => handleStatusChange(d.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-hidden cursor-pointer capitalize ${getStatusBadge(
                            d.status
                          )}`}
                        >
                          <option value="available">Available</option>
                          <option value="on_duty">On Trip / Duty</option>
                          <option value="off_duty">Off Duty</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(d.id)}
                          title="Remove driver"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    {t.common.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddDriverModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
