import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Customer, Driver, Vehicle } from '../types';
import { X, Calendar, MapPin, User, Car, ShieldAlert, Check } from 'lucide-react';

export const NewBookingModal: React.FC = () => {
  const { isNewBookingOpen, setIsNewBookingOpen, t, addToast, triggerRefresh, user } = useApp();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [estimatedFare, setEstimatedFare] = useState('650');
  const [rideStatus, setRideStatus] = useState<'Pending' | 'Confirmed' | 'In Progress'>('Confirmed');
  const [paymentStatus, setPaymentStatus] = useState<'Pending' | 'Paid'>('Pending');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick route presets for Pune & Mumbai metropolitan demonstrations
  const routePresets = [
    { from: 'Pune Airport (PNQ), Lohegaon', to: 'JW Marriott, Senapati Bapat Rd', fare: '850' },
    { from: 'Chhatrapati Shivaji Terminal (CSMT)', to: 'Bandra Kurla Complex (BKC)', fare: '620' },
    { from: 'Kothrud Stand, Pune', to: 'Magarpatta Cybercity, Hadapsar', fare: '540' },
    { from: 'Hinjawadi Phase 3 Tech Park', to: 'Shivajinagar Railway Station', fare: '780' },
    { from: 'Vashi Plaza, Navi Mumbai', to: 'Domestic Airport T1, Mumbai', fare: '950' },
  ];

  useEffect(() => {
    if (isNewBookingOpen) {
      setErrorMsg(null);
      // Fetch available drivers, vehicles, and customers
      Promise.all([
        api.getCustomers().catch(() => []),
        api.getVehicles().catch(() => []),
        api.getDrivers().catch(() => []),
      ]).then(([custs, vehs, drvs]) => {
        setCustomers(custs);
        setVehicles(vehs);
        setDrivers(drvs);

        // Preselect available vehicle & driver if any
        const availVeh = vehs.find((v) => v.status === 'available');
        if (availVeh) {
          setVehicleId(availVeh.id);
          if (availVeh.assigned_driver_id) {
            setDriverId(availVeh.assigned_driver_id);
          }
        }
        const availDrv = drvs.find((d) => d.status === 'available');
        if (availDrv && !driverId) {
          setDriverId(availDrv.id);
        }
      });
    }
  }, [isNewBookingOpen]);

  if (!isNewBookingOpen) return null;

  const handleCustomerSelect = (id: string) => {
    setCustomerId(id);
    const selected = customers.find((c) => c.id === id);
    if (selected) {
      setCustomerName(selected.name);
      setCustomerPhone(selected.phone);
    }
  };

  const handleApplyPreset = (preset: { from: string; to: string; fare: string }) => {
    setPickupLocation(preset.from);
    setDestination(preset.to);
    setEstimatedFare(preset.fare);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role === 'viewer') {
      addToast('Viewers have read-only access. Switch to Admin or Staff to create bookings.', 'error');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !pickupLocation.trim() || !destination.trim()) {
      setErrorMsg('Please enter customer name, phone, pickup, and destination.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      await api.createBooking({
        customer_id: customerId || undefined,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        pickup_location: pickupLocation.trim(),
        destination: destination.trim(),
        vehicle_id: vehicleId || null,
        driver_id: driverId || null,
        estimated_fare: Number(estimatedFare) || 500,
        ride_status: rideStatus,
        payment_status: paymentStatus,
        booking_time: new Date().toISOString(),
      });

      addToast(`Booking created successfully for ${customerName}!`, 'success');
      triggerRefresh();
      setIsNewBookingOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600 rounded-lg text-white">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">{t.bookings.createBooking}</h3>
              <p className="text-xs text-slate-300">Schedule & dispatch new passenger ride</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewBookingOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Route Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Quick Popular Routes (College Demo)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {routePresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200 rounded-lg text-slate-700 transition-colors"
                >
                  {p.from.split(',')[0]} → {p.to.split(',')[0]} (₹{p.fare})
                </button>
              ))}
            </div>
          </div>

          {/* Customer Selection / Entry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Existing Customer (Optional)
              </label>
              <select
                value={customerId}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
              >
                <option value="">-- Choose registered customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Customer Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98201 12345"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Estimated Fare (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={estimatedFare}
                onChange={(e) => setEstimatedFare(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Pickup and Destination */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Pickup Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Enter pickup address or landmark..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Destination <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-purple-600 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter drop destination..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Vehicle and Driver Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Assign Vehicle
              </label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
              >
                <option value="">-- No vehicle yet --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} disabled={v.status === 'on_trip'}>
                    {v.registration_number} ({v.make_model} - {v.type}) {v.status !== 'available' ? `[${v.status}]` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Assign Driver
              </label>
              <select
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
              >
                <option value="">-- No driver yet --</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id} disabled={d.status === 'on_duty'}>
                    {d.name} ({d.phone}) {d.status !== 'available' ? `[${d.status}]` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ride & Payment Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Initial Ride Status
              </label>
              <select
                value={rideStatus}
                onChange={(e) => setRideStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 focus:outline-hidden"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid (Simulate Demo)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewBookingOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating Booking...' : 'Confirm & Dispatch Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
