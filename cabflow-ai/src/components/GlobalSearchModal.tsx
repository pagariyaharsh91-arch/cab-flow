import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Booking, Customer, Driver, Vehicle } from '../types';
import { Search, X, Calendar, User, Car, UserCheck, ArrowRight, Loader2 } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, setActiveTab } = useApp();
  const [results, setResults] = useState<{
    bookings: Booking[];
    customers: Customer[];
    drivers: Driver[];
    vehicles: Vehicle[];
  }>({ bookings: [], customers: [], drivers: [], vehicles: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults({ bookings: [], customers: [], drivers: [], vehicles: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await api.searchGlobal(searchQuery.trim());
        setResults(data);
      } catch (e) {
        console.warn('Search failed:', e);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isSearchOpen) return null;

  const totalResults =
    results.bookings.length + results.customers.length + results.drivers.length + results.vehicles.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings, customers, cabs, drivers, routes..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-hidden text-slate-900 placeholder:text-slate-400"
          />
          {isLoading && <Loader2 className="w-4 h-4 text-purple-600 animate-spin shrink-0" />}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {searchQuery && !isLoading && totalResults === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              No matching records found for "{searchQuery}". Try searching for a driver name (e.g. Suresh), booking ID (e.g. CB-8921), or registration (e.g. MH-12).
            </div>
          )}

          {!searchQuery && (
            <div className="text-center py-8 text-slate-400 text-xs">
              Type keywords above to search across Bookings, Customers, Fleet, and Drivers in real-time.
            </div>
          )}

          {/* Bookings Results */}
          {results.bookings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                <span>Bookings ({results.bookings.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.bookings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setActiveTab('bookings');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-xs text-purple-700">{b.id}</span>
                        <span className="text-xs font-medium text-slate-900">{b.customer_name}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-600">{b.pickup_location} → {b.destination}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Fare: ₹{b.estimated_fare} · Status: {b.ride_status} · {new Date(b.booking_time).toLocaleString()}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customers Results */}
          {results.customers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Customers ({results.customers.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveTab('customers');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-900">{c.name}</span>
                      <span className="text-xs text-slate-500 ml-2">{c.phone}</span>
                      {c.address && <span className="text-xs text-slate-400 ml-2">({c.address})</span>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fleet Results */}
          {results.vehicles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <Car className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vehicles ({results.vehicles.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setActiveTab('fleet');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                  >
                    <div>
                      <span className="font-mono text-xs font-semibold text-slate-900">{v.registration_number}</span>
                      <span className="text-xs text-slate-600 ml-2">{v.make_model} ({v.type})</span>
                      <span className="text-xs text-emerald-600 font-medium ml-2">· {v.status}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Drivers Results */}
          {results.drivers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Drivers ({results.drivers.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.drivers.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveTab('drivers');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-900">{d.name}</span>
                      <span className="text-xs text-slate-500 ml-2">{d.phone}</span>
                      <span className="font-mono text-xs text-slate-400 ml-2">License: {d.license_number}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
          <span>Esc to close</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
};
