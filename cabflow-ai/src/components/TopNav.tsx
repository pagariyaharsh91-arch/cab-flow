import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language, UserRole } from '../types';
import {
  Menu,
  Search,
  Mic,
  Globe,
  Plus,
  User as UserIcon,
  ChevronDown,
  Shield,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const TopNav: React.FC<{ onOpenSidebar: () => void }> = ({ onOpenSidebar }) => {
  const {
    activeTab,
    lang,
    setLang,
    t,
    user,
    switchRole,
    setIsNewBookingOpen,
    setIsVoiceModalOpen,
    setIsSearchOpen,
    dbHealth,
  } = useApp();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return t.nav.dashboard;
      case 'bookings':
        return t.nav.bookings;
      case 'fleet':
        return t.nav.fleet;
      case 'drivers':
        return t.nav.drivers;
      case 'customers':
        return t.nav.customers;
      case 'payments':
        return t.nav.payments;
      case 'reports':
        return t.nav.reports;
      case 'activity':
        return t.nav.activity;
      case 'settings':
        return t.nav.settings;
      default:
        return 'Overview';
    }
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-purple-700 hidden sm:inline">CabFlow AI</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="font-bold text-slate-800 text-sm sm:text-base">{getPageTitle()}</span>
        </div>
      </div>

      {/* Middle: Global Search Trigger */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{t.topbar.searchPlaceholder}</span>
          </div>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-500 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Voice, Language, New Booking, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 md:hidden"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Web Speech Voice Assistant Button */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          title="Voice Assistant (Web Speech API)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all shadow-2xs"
        >
          <Mic className="w-3.5 h-3.5 text-purple-600" />
          <span className="hidden sm:inline">{t.topbar.voiceCommand}</span>
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold uppercase">{lang}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isLangMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsLangMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
                      lang === l.code
                        ? 'bg-purple-50 text-purple-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Primary Action Button: + New Booking */}
        <button
          onClick={() => setIsNewBookingOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm shadow-purple-600/20 transition-all hover:scale-102 active:scale-98 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t.topbar.newBooking}</span>
          <span className="sm:hidden">Booking</span>
        </button>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="text-left hidden xl:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-500 capitalize">{user?.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          {isUserMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsUserMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-40 animate-in fade-in zoom-in-95 duration-100 space-y-3">
                <div className="px-2 py-1">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500">{user?.email}</p>
                </div>

                {/* Role Switcher for College Evaluation */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <Shield className="w-3 h-3 text-purple-600" />
                    <span>Evaluation Role Switcher</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-1">
                    {(['admin', 'staff', 'viewer'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          switchRole(r);
                          setIsUserMenuOpen(false);
                        }}
                        className={`py-1 px-1.5 text-[10px] font-semibold rounded-lg capitalize transition-colors ${
                          user?.role === r
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-xs px-1">
                  <span className="text-[11px] text-slate-500">
                    Engine: {dbHealth?.isConnectedToMySQL ? 'Aiven' : 'Local'}
                  </span>
                  <button
                    onClick={() => {
                      switchRole('admin');
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
