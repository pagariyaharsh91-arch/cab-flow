import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Driver, Vehicle } from '../types';
import { AddVehicleModal } from '../components/AddVehicleModal';
import {
  Car,
  Search,
  Plus,
  Trash2,
  Wrench,
  CheckCircle,
  AlertCircle,
  Users,
  Shield,
} from 'lucide-react';

export const FleetPage: React.FC = () => {
  const { t, addToast, triggerRefresh, refreshTrigger, user } = useApp();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.getVehicles({ search, type: typeFilter, status: statusFilter }),
      api.getDrivers().catch(() => []),
    ])
      .then(([vList, dList]) => {
        setVehicles(vList);
        setDrivers(dList);
      })
      .catch((e) => addToast('Failed to load fleet data', 'error'))
      .finally(() => setIsLoading(false));
  }, [search, typeFilter, statusFilter, refreshTrigger]);

  const handleStatusChange = async (id: string, newStatus: any) => {
    if (user?.role === 'viewer') {
      addToast('Viewers have read-only access.', 'error');
      return;
    }
    try {
      await api.updateVehicle(id, { status: newStatus });
      addToast(`Vehicle status updated to ${newStatus}`, 'success');
      triggerRefresh();
    } catch (err: any) {
      addToast(err.message || 'Failed to update vehicle', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (user?.role === 'viewer') {
      addToast('Viewers have read-only access.', 'error');
      return;
    }
    if (!window.confirm(t.fleet.deleteVehicleConfirm)) return;
    try {
      await api.deleteVehicle(id);
      addToast(`Vehicle ${id} removed from fleet`, 'info');
      triggerRefresh();
    } catch (err: any) {
      addToast(err.message || 'Cannot delete vehicle', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'on_trip':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'maintenance':
        return 'bg-amber-50 text-amber-700 border-amber-200';
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
            {t.fleet.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.fleet.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all hover:scale-102 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.fleet.addVehicle}</span>
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
            placeholder="Search registration number, make, model..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="all">{t.fleet.allTypes}</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Premium">Premium</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="all">{t.fleet.allStatuses}</option>
            <option value="available">Available</option>
            <option value="on_trip">On Trip</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Fleet Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t.fleet.regNumber}</th>
                <th className="py-3 px-4">{t.fleet.model}</th>
                <th className="py-3 px-4">{t.fleet.type}</th>
                <th className="py-3 px-4">{t.fleet.capacity}</th>
                <th className="py-3 px-4">{t.fleet.assignedDriver}</th>
                <th className="py-3 px-4">{t.fleet.status}</th>
                <th className="py-3 px-4">{t.fleet.notes}</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {vehicles.length > 0 ? (
                vehicles.map((v) => {
                  const driver = drivers.find((d) => d.id === v.assigned_driver_id);
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-purple-600" />
                          <span>{v.registration_number}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">{v.id}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {v.make_model}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {v.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                        {v.seating_capacity} seats
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {driver ? (
                          <div>
                            <div className="font-semibold text-slate-900">{driver.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{driver.phone}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={v.status}
                          onChange={(e) => handleStatusChange(v.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-hidden cursor-pointer capitalize ${getStatusBadge(
                            v.status
                          )}`}
                        >
                          <option value="available">Available</option>
                          <option value="on_trip">On Trip</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 max-w-[200px] text-slate-500 truncate" title={v.maintenance_notes}>
                        {v.maintenance_notes || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(v.id)}
                          title="Remove vehicle"
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
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    {t.common.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddVehicleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
