import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Booking, Driver, Vehicle } from '../types';
import {
  CalendarCheck,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Ban,
  Car,
  User,
  MoreVertical,
  ArrowUpDown,
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const { t, setIsNewBookingOpen, openRecordPayment, addToast, triggerRefresh, refreshTrigger, user } = useApp();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.getBookings({ search, ride_status: statusFilter, payment_status: paymentFilter }),
      api.getVehicles().catch(() => []),
      api.getDrivers().catch(() => []),
    ])
      .then(([bList, vList, dList]) => {
        setBookings(bList);
        setVehicles(vList);
        setDrivers(dList);
      })
      .catch((e) => addToast('Failed to fetch bookings', 'error'))
      .finally(() => setIsLoading(false));
  }, [search, statusFilter, paymentFilter, refreshTrigger]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (user?.role === 'viewer') {
      addToast('Viewers have read-only access.', 'error');
      return;
    }
    try {
      await api.updateBookingStatus(id, { ride_status: newStatus });
      addToast(`Booking ${id} status updated to ${newStatus}`, 'success');
      triggerRefresh();
    } catch (err: any) {
      addToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (user?.role === 'viewer') {
      addToast('Viewers have read-only access.', 'error');
      return;
    }
    if (!window.confirm(t.bookings.deleteConfirm)) return;
    try {
      await api.deleteBooking(id);
      addToast(`Booking ${id} deleted`, 'info');
      triggerRefresh();
    } catch (err: any) {
      addToast(err.message || 'Failed to delete booking', 'error');
    }
  };

  const handleExportCSV = () => {
    if (bookings.length === 0) {
      addToast('No records to export', 'info');
      return;
    }

    const headers = [
      'Booking ID',
      'Customer Name',
      'Phone',
      'Pickup Location',
      'Destination',
      'Booking Time',
      'Vehicle ID',
      'Driver ID',
      'Estimated Fare',
      'Ride Status',
      'Payment Status',
    ];

    const rows = bookings.map((b) => [
      b.id,
      `"${b.customer_name}"`,
      `"${b.customer_phone}"`,
      `"${b.pickup_location.replace(/"/g, '""')}"`,
      `"${b.destination.replace(/"/g, '""')}"`,
      b.booking_time,
      b.vehicle_id || 'N/A',
      b.driver_id || 'N/A',
      b.estimated_fare,
      b.ride_status,
      b.payment_status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CabFlow_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Bookings CSV exported successfully!', 'success');
  };

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

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const displayedBookings = bookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.bookings.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.bookings.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.bookings.exportCSV}</span>
          </button>
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>{t.bookings.createBooking}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t.bookings.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 md:flex-initial px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="all">{t.bookings.allStatuses}</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 md:flex-initial px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="all">{t.bookings.allPayments}</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t.bookings.bookingId}</th>
                <th className="py-3 px-4">{t.bookings.customer}</th>
                <th className="py-3 px-4">{t.bookings.route}</th>
                <th className="py-3 px-4">{t.bookings.cabDriver}</th>
                <th className="py-3 px-4">{t.bookings.fare}</th>
                <th className="py-3 px-4">{t.bookings.rideStatus}</th>
                <th className="py-3 px-4">{t.bookings.payment}</th>
                <th className="py-3 px-4 text-right">{t.bookings.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {displayedBookings.length > 0 ? (
                displayedBookings.map((b) => {
                  const assignedVeh = vehicles.find((v) => v.id === b.vehicle_id);
                  const assignedDrv = drivers.find((d) => d.id === b.driver_id);

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-700 whitespace-nowrap">
                        {b.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-900 font-semibold">{b.customer_name}</div>
                        <div className="text-slate-400 text-[11px] font-mono">{b.customer_phone}</div>
                      </td>
                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="text-slate-800 truncate" title={b.pickup_location}>
                          {b.pickup_location}
                        </div>
                        <div className="text-slate-400 text-[11px] truncate flex items-center gap-1" title={b.destination}>
                          <span>↓</span>
                          <span>{b.destination}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-slate-800 font-medium text-[11px]">
                          {assignedVeh ? `${assignedVeh.registration_number} (${assignedVeh.make_model})` : 'No Cab'}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {assignedDrv ? assignedDrv.name : 'No Driver'}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 tabular-nums">
                        ₹{b.estimated_fare}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {/* Interactive Status Transition Dropdown */}
                        <select
                          value={b.ride_status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-hidden cursor-pointer ${getStatusBadge(
                            b.ride_status
                          )}`}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {b.payment_status === 'Paid' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => openRecordPayment(b)}
                            className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                          >
                            Pay ₹{b.estimated_fare}
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(b.id)}
                          title="Delete booking"
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {Math.min(bookings.length, (currentPage - 1) * itemsPerPage + 1)} to{' '}
              {Math.min(bookings.length, currentPage * itemsPerPage)} of {bookings.length} bookings
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg font-mono text-xs font-semibold ${
                    currentPage === i + 1
                      ? 'bg-purple-600 text-white'
                      : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
