import React from 'react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';
import {
  LayoutDashboard,
  CalendarCheck,
  Car,
  Users,
  UserCheck,
  CreditCard,
  BarChart3,
  History,
  Settings,
  Database,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, t, dbHealth, addToast, triggerRefresh } = useApp();

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    onClose();
  };

  const handleReloadDemo = async () => {
    try {
      const res = await api.seedDemo();
      addToast(res.message, 'success');
      triggerRefresh();
    } catch (e: any) {
      addToast(e.message || 'Failed to reload demo data', 'error');
    }
  };

  const navItems = [
    {
      group: t.workspace,
      items: [
        { id: 'dashboard' as NavTab, label: t.nav.dashboard, icon: LayoutDashboard },
        { id: 'bookings' as NavTab, label: t.nav.bookings, icon: CalendarCheck },
        { id: 'fleet' as NavTab, label: t.nav.fleet, icon: Car },
        { id: 'drivers' as NavTab, label: t.nav.drivers, icon: Users },
        { id: 'customers' as NavTab, label: t.nav.customers, icon: UserCheck },
      ],
    },
    {
      group: t.management,
      items: [
        { id: 'payments' as NavTab, label: t.nav.payments, icon: CreditCard },
        { id: 'reports' as NavTab, label: t.nav.reports, icon: BarChart3 },
        { id: 'activity' as NavTab, label: t.nav.activity, icon: History },
        { id: 'settings' as NavTab, label: t.nav.settings, icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Persistent Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0B132B] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 bg-gradient-to-r from-purple-950/40 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-900/40">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                <span>{t.brand}</span>
              </div>
              <p className="text-[10px] text-purple-300/80 uppercase tracking-wider font-semibold">
                Fleet Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {group.group}
              </div>
              <div className="mt-1.5 space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Database & Quick Demo Box */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          {/* Database Health Pill */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                <span>{dbHealth?.isConnectedToMySQL ? 'Aiven Cloud MySQL' : 'Local Persistent Engine'}</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${dbHealth?.isConnectedToMySQL ? 'bg-emerald-400' : 'bg-purple-400'}`} />
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              {dbHealth?.records.bookings ?? 6} bookings · {dbHealth?.records.vehicles ?? 5} vehicles · {dbHealth?.records.drivers ?? 5} drivers
            </p>
          </div>

          {/* Quick Demo Seed Button */}
          <button
            onClick={handleReloadDemo}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-800/60 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.dashboard.seedDemoData}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
