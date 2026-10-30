import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Booking } from '../types';
import { X, CreditCard, ShieldCheck, Check } from 'lucide-react';

export const RecordPaymentModal: React.FC = () => {
  const {
    isRecordPaymentOpen,
    setIsRecordPaymentOpen,
    selectedBookingForPayment,
    t,
    addToast,
    triggerRefresh,
    user,
  } = useApp();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('850');
  const [method, setMethod] = useState<'UPI' | 'Card' | 'Cash' | 'NetBanking'>('UPI');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isRecordPaymentOpen) {
      if (selectedBookingForPayment) {
        setSelectedBookingId(selectedBookingForPayment.id);
        setCustomerName(selectedBookingForPayment.customer_name);
        setAmount(String(selectedBookingForPayment.estimated_fare));
      } else {
        api.getBookings().then((list) => {
          setBookings(list);
          const pending = list.find((b) => b.payment_status === 'Pending');
          if (pending) {
            setSelectedBookingId(pending.id);
            setCustomerName(pending.customer_name);
            setAmount(String(pending.estimated_fare));
          }
        });
      }
    }
  }, [isRecordPaymentOpen, selectedBookingForPayment]);

  if (!isRecordPaymentOpen) return null;

  const handleBookingChange = (id: string) => {
    setSelectedBookingId(id);
    const b = bookings.find((item) => item.id === id);
    if (b) {
      setCustomerName(b.customer_name);
      setAmount(String(b.estimated_fare));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role === 'viewer') {
      addToast('Viewers have read-only permissions.', 'error');
      return;
    }

    if (!selectedBookingId || !amount) {
      addToast('Please select a booking and enter the payment amount', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await api.recordPayment({
        booking_id: selectedBookingId,
        customer_name: customerName || 'Passenger',
        amount: Number(amount),
        method,
        status: 'Success',
      });

      addToast(`Demo Payment of ₹${amount} successfully recorded for ${customerName}!`, 'success');
      triggerRefresh();
      setIsRecordPaymentOpen(false);
    } catch (err: any) {
      addToast(err.message || 'Payment recording failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">{t.payments.recordPayment}</h3>
              <p className="text-xs text-slate-300">Simulate verified settlement</p>
            </div>
          </div>
          <button
            onClick={() => setIsRecordPaymentOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.payments.demoNotice.split(':')[0]}</span>
            </div>
            {t.payments.demoNotice}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Booking
            </label>
            {selectedBookingForPayment ? (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-purple-700">
                {selectedBookingForPayment.id} ({selectedBookingForPayment.customer_name} - ₹{selectedBookingForPayment.estimated_fare})
              </div>
            ) : (
              <select
                value={selectedBookingId}
                onChange={(e) => handleBookingChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
              >
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} - {b.customer_name} (₹{b.estimated_fare}) [{b.payment_status}]
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Payment Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden font-medium"
              >
                <option value="UPI">UPI (Google Pay, PhonePe)</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="Cash">Cash to Driver</option>
                <option value="NetBanking">Net Banking</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsRecordPaymentOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              {isLoading ? 'Recording...' : 'Confirm Demo Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
