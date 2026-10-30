import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { DashboardSummary } from '../types';
import {
  CalendarCheck,
  TrendingUp,
  Car,
  Users,
  UserCheck,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Fuel,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { t, setActiveTab, setIsNewBookingOpen, addToast, triggerRefresh, refreshTrigger, openRecordPayment, user } =
    useApp();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getDashboardSummary()
      .then((summary) => setData(summary))
      .catch((e) => addToast('Failed to load dashboard metrics', 'error'))
      .finally(() => setIsLoading(false));
  }, [refreshTrigger]);

  const handleSeedDemo = async () => {
    try {
      const res = await api.seedDemo();
      addToast(res.message, 'success');
      triggerRefresh();
    } catch (e: any) {
      addToast(e.message || 'Failed to reload demo', 'error');
    }
  };

  const handleClearDemo = async () => {
    if (user?.role === 'viewer') {
      addToast('Viewers cannot clear data.', 'error');
      return;
    }
    try {
      const res = await api.clearDemo();
      addToast(res.message, 'info');
      triggerRefresh();
    } catch (e: any) {
      addToast(e.message || 'Failed to clear data', 'error');
    }
  };

  const kpis = data?.kpis;

  const statCards = [
    {
      title: t.dashboard.totalBookings,
      value: kpis?.totalBookings ?? 0,
      icon: CalendarCheck,
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t.dashboard.activeRides,
      value: kpis?.activeRides ?? 0,
      icon: Clock,
      color: 'from-purple-600 to-pink-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: t.dashboard.availableVehicles,
      value: `${kpis?.availableVehicles ?? 0} / ${kpis?.totalVehicles ?? 0}`,
      icon: Car,
      color: 'from-emerald-600 to-teal-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: t.dashboard.completedRides,
      value: kpis?.completedRides ?? 0,
      icon: CheckCircle2,
      color: 'from-cyan-600 to-blue-600',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      title: t.dashboard.monthlyRevenue,
      value: `₹${(kpis?.totalRevenue ?? 0).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'from-purple-700 to-violet-800',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
    },
    {
      title: t.dashboard.pendingPayments,
      value: `₹${(kpis?.pendingPaymentsAmount ?? 0).toLocaleString('en-IN')} (${kpis?.pendingPaymentsCount ?? 0})`,
      icon: AlertCircle,
      color: 'from-amber-600 to-orange-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: t.dashboard.registeredDrivers,
      value: kpis?.totalDrivers ?? 0,
      icon: Users,
      color: 'from-slate-700 to-slate-900',
      textColor: 'text-slate-700',
      bgColor: 'bg-slate-100',
    },
    {
      title: t.dashboard.registeredCustomers,
      value: kpis?.totalCustomers ?? 0,
      icon: UserCheck,
      color: 'from-indigo-600 to-purple-600',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSeedDemo}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>{t.dashboard.seedDemoData}</span>
          </button>
          <button
            onClick={handleClearDemo}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{t.dashboard.clearData}</span>
            <span className="sm:hidden">Reset</span>
          </button>
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>{t.topbar.newBooking}</span>
          </button>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
                    {card.value}
                  </h3>
                </div>
                <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Availability Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview 7-Day Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {t.dashboard.revenueOverview}
              </h3>
              <p className="text-xs text-slate-400">Database-backed settlement telemetry</p>
            </div>
            <span className="text-xs font-mono font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
              INR (₹)
            </span>
          </div>

          <div className="h-64 w-full">
            {data?.revenueOverview && data.revenueOverview.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueOverview} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '0.75rem',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#7C3AED"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No revenue records available.
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Fleet Status Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              {t.dashboard.vehicleAvailability}
            </h3>
            <button
              onClick={() => setActiveTab('fleet')}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800"
            >
              {t.dashboard.viewAll}
            </button>
          </div>

          <div className="space-y-3.5 pt-2">
            {data?.vehicleByType &&
              Object.entries(data.vehicleByType).map(([type, stats]) => {
                const percentage = stats.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0;
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{type}</span>
                      <span className="font-mono text-slate-500">
                        {stats.available} / {stats.total} avail ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Maintenance checks active</span>
            <span className="font-semibold text-emerald-600">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {t.dashboard.recentBookings}
              </h3>
              <p className="text-xs text-slate-400">Live dispatch and customer rides</p>
            </div>
            <button
              onClick={() => setActiveTab('bookings')}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <span>{t.dashboard.viewAll}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Table */}
          {data?.recentBookings && data.recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">{t.bookings.bookingId}</th>
                    <th className="py-2.5 px-3">{t.bookings.customer}</th>
                    <th className="py-2.5 px-3">{t.bookings.route}</th>
                    <th className="py-2.5 px-3">{t.bookings.fare}</th>
                    <th className="py-2.5 px-3">{t.bookings.rideStatus}</th>
                    <th className="py-2.5 px-3 text-right">{t.bookings.payment}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {data.recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-purple-700">
                        {b.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-900 font-semibold">{b.customer_name}</div>
                        <div className="text-slate-400 text-[11px] font-mono">{b.customer_phone}</div>
                      </td>
                      <td className="py-3 px-3 max-w-[200px] truncate text-slate-600">
                        <span>{b.pickup_location.split(',')[0]}</span>
                        <span className="text-slate-400 mx-1">→</span>
                        <span>{b.destination.split(',')[0]}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-800 tabular-nums">
                        ₹{b.estimated_fare}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                            b.ride_status
                          )}`}
                        >
                          {b.ride_status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {b.payment_status === 'Paid' ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => openRecordPayment(b)}
                            className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                          >
                            Pay ₹{b.estimated_fare}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <div>
                <p className="font-semibold text-slate-800 text-sm">{t.dashboard.emptyStateTitle}</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {t.dashboard.emptyStateDesc}
                </p>
              </div>
              <button
                onClick={handleSeedDemo}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.dashboard.loadDemo}</span>
              </button>
            </div>
          )}
        </div>

        {/* Live Activity Stream */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {t.dashboard.recentActivity}
              </h3>
              <p className="text-xs text-slate-400">Server-logged audit stream</p>
            </div>
            <button
              onClick={() => setActiveTab('activity')}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800"
            >
              {t.dashboard.viewAll}
            </button>
          </div>

          <div className="space-y-3">
            {data?.latestActivity && data.latestActivity.length > 0 ? (
              data.latestActivity.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 hover:bg-purple-50/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold text-purple-700 uppercase">
                      {log.action_type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed">{log.description}</p>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 text-center py-6">
                No activity logs recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
