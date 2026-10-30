import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  BarChart3,
  Download,
  TrendingUp,
  MapPin,
  Car,
  Users,
  CreditCard,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const { t, addToast, refreshTrigger } = useApp();
  const [reports, setReports] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getReports()
      .then(setReports)
      .catch((e) => addToast('Failed to load reports', 'error'))
      .finally(() => setIsLoading(false));
  }, [refreshTrigger]);

  const handleExportCSV = () => {
    if (!reports) return;

    let csv = 'Report: CabFlow AI Fleet Operations & Revenue Analysis\n';
    csv += `Generated: ${new Date().toISOString()}\n\n`;

    csv += '--- Most Frequented Routes ---\n';
    csv += 'Route,Trip Count,Total Revenue (INR)\n';
    reports.topRoutes.forEach((r: any) => {
      csv += `"${r.route}",${r.count},${r.revenue}\n`;
    });

    csv += '\n--- Vehicle Utilization ---\n';
    csv += 'Vehicle ID,Model,Registration,Category,Completed Trips\n';
    reports.vehicleUtil.forEach((v: any) => {
      csv += `${v.vehicleId},"${v.model}","${v.reg}",${v.type},${v.completedTrips}\n`;
    });

    csv += '\n--- Driver Productivity ---\n';
    csv += 'Driver ID,Driver Name,Completed Trips,Total Fare Generated\n';
    reports.driverActivity.forEach((d: any) => {
      csv += `${d.driverId},"${d.name}",${d.completedRides},${d.totalEarnings}\n`;
    });

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CabFlow_Operations_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Comprehensive report exported as CSV!', 'success');
  };

  const colors = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.reports.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.reports.subtitle}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all hover:scale-102 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{t.reports.exportReport}</span>
        </button>
      </div>

      {/* Top Routes & Vehicle Utilization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Frequented Routes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {t.reports.topRoutes}
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {reports?.topRoutes && reports.topRoutes.length > 0 ? (
              reports.topRoutes.map((r: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-mono font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{r.route}</span>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-bold text-slate-900">{r.count} trips</div>
                    <div className="text-[10px] text-purple-700 font-medium">₹{r.revenue.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">No route data yet.</div>
            )}
          </div>
        </div>

        {/* Vehicle Utilization Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {t.reports.vehicleUtilization}
            </h3>
          </div>

          <div className="h-64 w-full pt-2">
            {reports?.vehicleUtil && reports.vehicleUtil.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reports.vehicleUtil} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="reg" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '0.75rem',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: any, item: any) => [
                      `${val} Trips (${item.payload.model})`,
                      'Utilization',
                    ]}
                  />
                  <Bar dataKey="completedTrips" radius={[6, 6, 0, 0]}>
                    {reports.vehicleUtil.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No vehicle trip telemetry.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Driver Productivity Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {t.reports.driverEarnings}
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Driver Name</th>
                <th className="py-3 px-4">Driver ID</th>
                <th className="py-3 px-4">Completed Rides</th>
                <th className="py-3 px-4">Total Revenue Generated</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {reports?.driverActivity && reports.driverActivity.length > 0 ? (
                reports.driverActivity.map((d: any) => (
                  <tr key={d.driverId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {d.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {d.driverId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 tabular-nums">
                      {d.completedRides} rides
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-700 tabular-nums">
                      ₹{d.totalEarnings.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No driver records found.
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
